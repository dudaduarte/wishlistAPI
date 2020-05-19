'use strict'

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    externalProductId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reviewScore: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'Products'
  })

  Products.associate = function(models) {
    Products.belongsToMany(models.Wishlists, {
      through: 'WishlistProducts',
      foreignKey: 'productId'
    })
  }

  return Products
}
