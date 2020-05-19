'use strict'

module.exports = (sequelize, DataTypes) => {
  const WishlistProducts = sequelize.define('WishlistProducts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    wishlistId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Wishlists',
        key: 'id',
        as: 'wishlistId',
      },
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Products',
        key: 'id',
        as: 'wishlistId',
      },
      allowNull: false
    },
  }, {
    tableName: 'WishlistProducts'
  })

  return WishlistProducts
}
