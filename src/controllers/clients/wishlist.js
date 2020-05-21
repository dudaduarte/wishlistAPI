
const axios = require('axios')
const db = require('../../database/models')
const productApiUrl = 'http://challenge-api.luizalabs.com/api/product/'

const createProduct = async productId => {
  const url = productApiUrl.concat(productId)

  try {
    const { data } = await axios.get(url)

    return db.Products.create({
      externalProductId: data.id,
      title: data.title,
      image: data.image,
      price: data.price,
      reviewScore: data.reviewScore
    })
  }

  catch (error) {
    if (error.message === 'Request failed with status code 404') {
      throw new Error('Esse produto não existe.')
    }

    throw new Error(error.message)
  }
}

const handleProductObject = product => {
  const rawProduct = product.dataValues
  const id = product.externalProductId
  rawProduct.id = id

  delete rawProduct.externalProductId

  return rawProduct
}

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await db.Wishlists.findOne({
      where: { clientId: req.id }
    })

    if (!wishlist)
      throw new Error('O cliente informado não existe.')

    const wishlistProducts = await db.WishlistProducts.findAll({
      where: { wishlistId: wishlist.id }
    })

    const productsFromWishlist = wishlistProducts.map(wishlistProduct =>
      db.Products.findByPk(wishlistProduct.productId))

    const productsResolved = await Promise.all(productsFromWishlist)

    const productsHandled = productsResolved.map(product =>
      handleProductObject(product))

    return res.status(200).send(productsHandled)
  }

  catch (error) {
    return next(error)
  }
}

exports.getWishlistProduct = async (req, res, next) => {
  try {
    const wishlist = await db.Wishlists.findOne({
      where: { clientId: req.id }
    })

    if (!wishlist)
      throw new Error('O cliente informado não existe.')

    const product =
      await db.Products.findOne({
        where: { externalProductId: req.params.productId }
      })

    if (!product)
      throw new Error('Não foi possível encontrar o produto na wishlist desse cliente')

    const wishlistProduct = await db.WishlistProducts.findOne({
      where: {
        wishlistId: wishlist.id,
        productId: product.id
      }
    })

    if (!wishlistProduct) {
      throw new Error('Não foi possível encontrar o produto na wishlist desse cliente')
    }

    return res.status(200).send(handleProductObject(product))
  }

  catch (error) {
    return next(error)
  }
}

exports.postWishlistProduct = async (req, res, next) => {
  const { body } = req

  try {
    const findExistingClient = await db.Clients.findByPk(req.id)

    if (!findExistingClient)
      throw new Error('O cliente informado não existe.')

    const wishlist = await db.Wishlists.findOne({
      where: { clientId: req.id }
    })

    const existingProduct = await db.Products.findOne({
      where: { externalProductId: body.productId }
    })

    const product =
      existingProduct ? existingProduct : await createProduct(req.body.productId)

    const query = {
      productId: product.id,
      wishlistId: wishlist.id
    }

    const findExistingWishlistProduct = await db.WishlistProducts.findOne({
      where: query
    })

    if (findExistingWishlistProduct)
      throw new Error('Este produto já existe na wishlist desse cliente.')

    await db.WishlistProducts.create(query)

    return res.status(201).send(handleProductObject(product))
  }

  catch (error) {
    return next(error)
  }
}

exports.deleteWishlistProduct = async (req, res, next) => {
  try {
    const product = await db.Products.findOne({
      where: { externalProductId: req.params.productId }
    })

    if (!product)
      throw new Error('O produto informado não está nessa Wishlist')

    const wishlist = await db.Wishlists.findOne({
      where: { clientId: req.id }
    })

    if (!wishlist)
      throw new Error('O cliente informado não existe e não possui uma wishlist.')

    const wishlistProduct = await db.WishlistProducts.findOne({
      where: { productId: product.id, wishlistId: wishlist.id }
    })

    if (!wishlistProduct)
      throw new Error('O produto informado não está nessa Wishlist')

    await wishlistProduct.destroy()

    return res.status(200).send(handleProductObject(product))
  }

  catch (error) {
    return next(error)
  }
}
