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
      this.email = data.email;
      this.password = data.password;
      this.active = data.active;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      this.recipes = data.recipes;
      this.assets = data.assets;

      if (!data.id) {
        this.hashPassword();
      }
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
      return `${this.firstName} ${this.lastName}`;
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
    
    hashPassword () {
      this.password = BCrypt.hashSync(this.getPassword(), 8);
    }
    matchPassword (password) {
      return BCrypt.compare(password, this.getPassword());
    }

    static associate (models) {
      this.hasMany(models.recipe, {
        foreignKey: 'authorId'
      });

      this.hasMany(models.asset, {
        as: 'assets'
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  return User;
};
