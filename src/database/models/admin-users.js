'use strict'

module.exports = (sequelize, DataTypes) => {
  const AdminUsers = sequelize.define('AdminUsers', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    encryptedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'AdminUsers'
  })

  return AdminUsers
}
