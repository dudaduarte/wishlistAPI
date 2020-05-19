'use strict'

module.exports = (sequelize, DataTypes) => {
  const Wishlists = sequelize.define('Wishlists', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Wishlists'
  })

  Wishlists.associate = function(models) {
    Wishlists.belongsTo(models.Clients, { foreignKey: 'clientId' })
    Wishlists.belongsToMany(models.Products, {
      through: 'WishlistProducts',
      foreignKey: 'wishlistId'
    })
  }

  return Wishlists
}
