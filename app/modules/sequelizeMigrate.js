'use strict';

const Umzug = require('umzug');

function _paramsAreValid (receivedParams = {}) {
  const mandatoryParams = [
    'sequelize',
    'SequelizeImport',
    'migrationsDir'
  ];

  return mandatoryParams.every(param => Boolean(receivedParams[param]));
}

function migrate (params) {
  if (!_paramsAreValid(params)) {
    throw new Error(`sequelize, SequelizeImport and migrationsDir are required params`);
  }
  
  // required functions declaration
  const metaMutexesTb = 'SequelizeMetaMutexes';
  const createMutexTable = (sequelize) => {
    const sql = `CREATE TABLE IF NOT EXISTS "${metaMutexesTb}" ("mutex" INTEGER NOT NULL UNIQUE, "ts" TIMESTAMP WITHOUT TIME ZONE NOT NULL, "id" TEXT NOT NULL, PRIMARY KEY ("mutex"))`;

    return sequelize.query(sql, {
      replacements: {
        tableName: metaMutexesTb
      }
    });
  };

  const acquireLock = (sequelize, SequelizeImport, lockTimeout) => {
    return sequelize.transaction({
      isolationLevel: SequelizeImport.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    }, transaction => {
      const lockQuery = `LOCK TABLE "${metaMutexesTb}" IN ACCESS EXCLUSIVE MODE NOWAIT`;
      return sequelize.query(lockQuery, { transaction })
        .then(() => {
          const deleteOldRecord = `DELETE FROM "${metaMutexesTb}" WHERE "ts" < (NOW() - INTERVAL ':seconds SECONDS')`;
          return sequelize.query(deleteOldRecord, { 
            replacements: {
              seconds: lockTimeout
            },
            transaction 
          });
        }).then(() => {
          const insertQuery = `INSERT INTO "${metaMutexesTb}" ("mutex", "ts", "id") VALUES (1, NOW(), MD5(NOW()::TEXT)) RETURNING *`;
          return sequelize.query(insertQuery, { transaction }).then(([results]) => results);
        }).then(results => {
          const row = results[0];

          return Number(row.id);
        });
    });
  };

  const block = (until, umzug, sequelize, SequelizeImport, lockTimeout) => {
    return umzug.pending()
      .then((migrations) => {
        if (!migrations.length) {
          return '';
        }

        if (Date.now() >= until) {
          throw new Error('Timeout when running migrations');
        }

        return acquireLock(sequelize, SequelizeImport, lockTimeout);
      });
  };

  const releaseLock = (sequelize, id) => {
    const sql = `DELETE FROM "${metaMutexesTb}" WHERE "id" = :id`;

    return sequelize.query(sql, {
      replacements: {
        id,
        tableName: metaMutexesTb
      }
    });
  };

  // method execution
  const lockTimeout = (Number.isInteger(params.timeout) && params.timeout > 0) ? params.timeout : 15;
  const systemTimeout = lockTimeout * 2;
  const config = {
    storage: 'sequelize',
    storageOptions: {
      sequelize: params.sequelize
    },
    logging: typeof params.logging !== 'boolean' ? false : params.logging,
    migrations: {
      path: params.migrationsDir,
      params: [ params.sequelize.getQueryInterface(), params.SequelizeImport ],
      pattern: /.+\.js$/
    }
  };
  const umzug = new Umzug(config);

  let lockId = '';
  return params.sequelize.authenticate()
    .then(() => {
      return createMutexTable(params.sequelize);
    })
    .then(() => {
      const until = Date.now() + (systemTimeout * 1000);
      return block(until, umzug, params.sequelize, params.SequelizeImport, lockTimeout);
    })
    .then(id => {
      lockId = id ? id : '';
      return umzug.up();
    })
    .then(() => releaseLock(params.sequelize, lockId));
}

module.exports = {
  migrate
};
/* jshint ignore:end */