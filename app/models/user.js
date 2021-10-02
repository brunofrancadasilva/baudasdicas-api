'use strict';

const { Model } = require('sequelize');
const BCrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    constructor (data) {
      super(data);

      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.fullName = data.fullName;
      this.email = data.email;
      this.password = data.password;
      this.active = data.active;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      this.recipes = data.recipes;
      this.assets = data.assets;
      this.temporary_files = data.temporary_files;
    }

    getId () {
      return this.id;
    }
    getFirstName() {
      return this.firstName;
    }
    getLastName() {
      return this.lastName;
    }
    getFullName() {
      return this.fullName;
    }
    getEmail () {
      return this.email;
    }
    getPassword () {
      return this.password;
    }
    getUpdatedAt () {
      return this.updatedAt;
    }
    getCreatedAt () {
      return this.createdAt;
    }
    getIsActive () {
      return this.active;
    }
    
    matchPassword (password) {
      return BCrypt.compare(password, this.getPassword());
    }

    static associate (models) {
      this.hasMany(models.recipe, {
        as: 'recipes',
        foreignKey: 'authorId'
      });

      this.hasMany(models.temporary_file, {
        as: 'temporary_files'
      });
    }
  }
  
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get () {
        return `${this.firstName} ${this.lastName}`
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set (value) {
        if (!this.getDataValue('id')) {
          this.setDataValue('password', BCrypt.hashSync(value, 8));
        } else {
          this.setDataValue('password', value);
        }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    sequelize,
    modelName: 'user',
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] }
      }
    }
  });

  return User;
};
