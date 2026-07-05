'use strict';
const {
  Model
} = require('sequelize');
const {ENUM}=require('../utils/common');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {through:'User_Roles', as:'users'})
    }
  }

  Role.init({
    name: {
    type:DataTypes.ENUM,
    values:Object.values(ENUM.USER_ROLES_ENUMS),
    allowNull:false,
    defaultValue:ENUM.USER_ROLES_ENUMS.CUSTOMER
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};