
const axios = require('axios')
const db = require('../../database/models')
const { ApiError } = require('../../middlewares/error-handler')
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
      throw new ApiError('Esse produto não existe.', 404)
    }

    throw new ApiError(error.message, error.request.res.statusCode)
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
      throw new ApiError('O cliente informado não existe.', 404)

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
  const error =
    ['Não foi possível encontrar o produto na wishlist desse cliente', 404]

  try {
    const wishlist = await db.Wishlists.findOne({
      where: { clientId: req.id }
    })

    if (!wishlist)
      throw new ApiError('O cliente informado não existe.', 404)

    const product =
      await db.Products.findOne({
        where: { externalProductId: req.params.productId }
      })

    if (!product)
      throw new ApiError(...error)

    const wishlistProduct = await db.WishlistProducts.findOne({
      where: {
        wishlistId: wishlist.id,
        productId: product.id
      }
    })

    if (!wishlistProduct) {
      throw new ApiError(...error)
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
      throw new ApiError('O cliente informado não existe.', 404)

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
      throw new ApiError('Este produto já existe na wishlist desse cliente.', 409)

    await db.WishlistProducts.create(query)

    return res.status(201).send(handleProductObject(product))
  }

  catch (error) {
    return next(error)
  }
}

exports.deleteWishlistProduct = async (req, res, next) => {
  try {
    const error = ['O produto informado não está nessa Wishlist', 404]
    const product = await db.Products.findOne({
      where: { externalProductId: req.params.productId }
    })

    if (!product)
      throw new ApiError(...error)

    const wishlist = await db.Wishlists.findOne({
      where: { clientId: req.id }
    })

    if (!wishlist)
      throw new ApiError('O cliente informado não existe e não possui uma wishlist.', 404)

    const wishlistProduct = await db.WishlistProducts.findOne({
      where: { productId: product.id, wishlistId: wishlist.id }
    })

    if (!wishlistProduct)
      throw new ApiError(...error)

    await wishlistProduct.destroy()

    return res.status(200).send(handleProductObject(product))
  }

  catch (error) {
    return next(error)
  }
}
