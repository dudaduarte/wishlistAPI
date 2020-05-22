const chai = require('chai')
const chaiSubset = require('chai-subset');
const models = require('../../src/database/models')
const clientsController = require('../../src/controllers/clients')
const wishlistController = require('../../src/controllers/clients/wishlist')
const { errorHandler } = require('../../src/middlewares/error-handler')
const { expect } = chai

chai.use(chaiSubset)

const createClient = (name, email) => models.Clients.create({ name, email })
const createWishlist = (clientId) => models.Wishlists.create({ clientId })
const deleteClients = () => models.Clients.destroy({
  where: {},
  truncate: true
})
const deleteProducts = () => models.Products.destroy({
  where: {}
})
const deleteWishlists = () => models.Wishlists.destroy({
  where: {}
})
const next = res => error => errorHandler(error, res)

describe('Testing Clients routes', () => {
  let maria, joao, mariana
  const mockRes = {
    status: () => ({ send: a => a, json: b => b })
  }

  before(() => Promise.all([
    createClient('Maria', 'maria@gmail.com'),
    createClient('João', 'joao@gmail.com'),
    createClient('Mariana', 'mariana@gmail.com')
  ]).then(values => {
    [ maria, joao, mariana ] = values

    return Promise.all([
      createWishlist(maria.id),
      createWishlist(joao.id),
      createWishlist(mariana.id)
    ])
  }))


  after(() => deleteClients()
    .then(() => deleteProducts())
    .then(() => deleteWishlists()))

  describe('GET /clients', () => {
    const { getClients } = clientsController
    const mockReq = name => ({
      query: { name } || {}
    })

    it('should return all clients without any errors', async () => {
      const result = await getClients(mockReq(), mockRes)

      expect(result).to.have.lengthOf(3)
    })

    it('should return only the client who matches querystring provided', async () => {
      const result = await getClients(mockReq('Maria'), mockRes)

      expect(result).to.have.lengthOf(1)
      expect(result[0].name).to.equals('Maria')
    })

    it('should return an empty array when querystring provided doesn\'t match any client', async () => {
      const result = await getClients(mockReq('Alessandra'), mockRes)

      expect(result).to.have.lengthOf(0)
    })
  })

  describe('GET /clients/:id', () => {
    const { getClientById } = clientsController
    const mockReq = id => ({
      query: {},
      params: { id }
    })

    it('should return the client with id=1', async () => {
      const result = await getClientById(
        mockReq(maria.id),
        mockRes,
        next(mockRes)
      )

      expect(result.name).to.equals('Maria')
    })

    it('should throw an error when client id doesn\'t exist', async () => {
      const result = await getClientById(
        mockReq(0),
        mockRes,
        next(mockRes)
      )

      expect(result.error).to.containSubset({
        statusCode: 404,
        message: 'O cliente informado não existe.'
      })
    })
  })

  describe('PUT /clients/:id', () => {
    const { putClients } = clientsController
    const mockReq = (id, name, email) => ({
      query: {},
      params: { id },
      body: {
        name,
        email,
      }
    })

    it('should throw an error when trying to update a client with another clients email', async () => {
      const result = await putClients(
        mockReq(maria.id, 'Maria', 'mariana@gmail.com'),
        mockRes,
        next(mockRes)
      )

      expect(result.error).to.containSubset({
        statusCode: 409,
        message: 'Já existe cadastro vinculado ao email informado.'
      })
    })

    it('should edit clients name successfuly when providing the same email as before', async () => {
      const result = await putClients(
        mockReq(mariana.id, 'Marianinha', 'mariana@gmail.com'),
        mockRes,
        next(mockRes)
      )

      expect(result).to.have.property('name', 'Marianinha')
      expect(result).to.have.property('email', 'mariana@gmail.com')
    })
  })

  describe('POST /clients', () => {
    const { postClients } = clientsController
    const mockReq = (name, email) => ({
      query: {},
      body: {
        name,
        email,
      }
    })

    it('should throw an error when trying to create a client with another clients email', async () => {
      const result = await postClients(
        mockReq('Mariana Silva', 'mariana@gmail.com'),
        mockRes,
        next(mockRes)
      )

      expect(result.error).to.containSubset({
        statusCode: 409,
        message: 'Já existe cadastro vinculado ao email informado.'
      })
    })

    it('should create a client successfuly when providing an email that\'s not already in use', async () => {
      const result = await postClients(
        mockReq('Mariana Silva', 'mariana_silva@gmail.com'),
        mockRes,
        next(mockRes)
      )

      expect(result).to.have.property('name', 'Mariana Silva')
      expect(result).to.have.property('email', 'mariana_silva@gmail.com')
    })
  })

  describe('DELETE /clients/:id', () => {
    let clientToBeDeleted
    const { deleteClients, postClients } = clientsController
    const mockReq = id => ({
      query: {},
      params: { id }
    })

    before(async () => {
      clientToBeDeleted = await postClients(
        { query: {}, body: { name: 'Felícia', email: 'felicia@gmail.com' } },
        mockRes,
        next(mockRes)
      )
    })

    it('should throw an error when trying to delete a client that doesn\'t exist', async () => {
      const result = await deleteClients(
        mockReq(0),
        mockRes,
        next(mockRes)
      )

      expect(result.error).to.containSubset({
        statusCode: 404,
        message: 'O cliente informado não existe.'
      })
    })

    it('should create a client successfuly when providing an email that\'s not already in use', async () => {
      const result = await deleteClients(
        mockReq(clientToBeDeleted.id),
        mockRes,
        next(mockRes)
      )

      expect(result).to.have.property('name', 'Felícia')
      expect(result).to.have.property('email', 'felicia@gmail.com')
    })
  })

  describe('Testing /clients/:id/wishlist routes', () => {
    const products = [{
      id: '69d4bd0f-bf74-73d2-d71f-47038e9964fb',
      title: 'Colchão Plumatex Solteiro Mola 88x188cm',
      image: 'http://challenge-api.luizalabs.com/images/69d4bd0f-bf74-73d2-d71f-47038e9964fb.jpg',
      price: 699,
      reviewScore: null,
    }, {
      id: 'e6020eeb-74d3-a0b7-effd-e226be4296a7',
      title: 'Película Protetora para Samsung Galaxy Note 3',
      image: 'http://challenge-api.luizalabs.com/images/e6020eeb-74d3-a0b7-effd-e226be4296a7.jpg',
      price: 39.9,
      reviewScore: null,
    }, {
      id: '4e7230bf-6bc0-6aca-835c-6d60fa67c81d',
      title: 'Blush Face Color Enhancing Trio Cor OR1',
      image: 'http://challenge-api.luizalabs.com/images/4e7230bf-6bc0-6aca-835c-6d60fa67c81d.jpg',
      price: 268,
      reviewScore: null,
    }]

    describe('POST /clients/:id/wishlist', () => {
      const { postWishlistProduct } = wishlistController
      const mockReq = (id, productId) => ({
        query: {},
        params: { id },
        body: {
          productId
        },
        id
      })
  
      it('should add product successfully - when product doesn\' exists in Products', async () => {
        const result = await postWishlistProduct(
          mockReq(maria.id, products[0].id),
          mockRes,
          next(mockRes)
        )

        expect(result).to.have.property('id', products[0].id)
        expect(result).to.have.property('title', products[0].title)
      })

      it('should add product successfully - when product already exists in Products', async () => {
        const result = await postWishlistProduct(
          mockReq(joao.id, products[0].id),
          mockRes,
          next(mockRes)
        )

        expect(result).to.have.property('id', products[0].id)
        expect(result).to.have.property('title', products[0].title)
      })

      it('should fail to add product - when product doesn\'t exists in external API', async () => {
        const result = await postWishlistProduct(
          mockReq(joao.id, 'a1s2d3f4'),
          mockRes,
          next(mockRes)
        )

        expect(result.error).to.containSubset({
          statusCode: 404,
          message: 'Esse produto não existe.'
        })
      })
  
      it('should fail to add product - when client doesn\'t exists', async () => {
        const result = await postWishlistProduct(
          mockReq(0, products[1].id),
          mockRes,
          next(mockRes)
        )
  
        expect(result.error).to.containSubset({
          statusCode: 404,
          message: 'O cliente informado não existe.'
        })
      })
    })

    describe('GET /clients/:id/wishlist', () => {
      const { getWishlist, postWishlistProduct } = wishlistController
      const mockReq = (id, productId) => ({
        query: {},
        params: { id },
        body: { productId },
        id
      })

      before(async () => {
        await postWishlistProduct(
          mockReq(maria.id, products[1].id),
          mockRes,
          next(mockRes)
        )

        await postWishlistProduct(
          mockReq(maria.id, products[2].id),
          mockRes,
          next(mockRes)
        )
      })

      it('should show wishlist successfully - when client exists', async () => {
        const result = await getWishlist(
          mockReq(maria.id),
          mockRes,
          next(mockRes)
        )

        expect(result).to.have.lengthOf(3)
        result.forEach((product, index) =>
          expect(product)
            .to.have.property('id', products[index].id))
      })

      it('should show an empty wishlist - when client hasn\'t added any products as favorite', async () => {
        const result = await getWishlist(
          mockReq(mariana.id),
          mockRes,
          next(mockRes)
        )

        expect(result).to.have.lengthOf(0)
      })

      it('should throw an error - when client doesn\'t exist', async () => {
        const result = await getWishlist(
          mockReq(0),
          mockRes,
          next(mockRes)
        )

        expect(result.error).to.containSubset({
          statusCode: 404,
          message: 'O cliente informado não existe.'
        })
      })
    })

    describe('DELETE /clients/:id/wishlist/:productId', () => {
      const { deleteWishlistProduct } = wishlistController
      const mockReq = (id, productId) => ({
        query: {},
        params: { id, productId },
        id
      })

      it('should delete product successfully - when client has the product provided as favorite', async () => {
        const resultDelete = await deleteWishlistProduct(
          mockReq(maria.id, products[0].id),
          mockRes,
          next(mockRes)
        )

        expect(resultDelete).to.have.property('id', products[0].id)
      })

      it('should throw an error - when client doesn\'t have the product provided as favorite', async () => {
        const result = await deleteWishlistProduct(
          mockReq(mariana.id, '895e794a-724c-c5f3-db1b-3ca4b212e7de'),
          mockRes,
          next(mockRes)
        )

        expect(result.error).to.containSubset({
          statusCode: 404,
          message: 'O produto informado não está nessa Wishlist'
        })
      })

      it('should throw an error - when client doesn\'t exist', async () => {
        const result = await deleteWishlistProduct(
          mockReq(0, products[0].id),
          mockRes,
          next(mockRes)
        )

        expect(result.error).to.containSubset({
          statusCode: 404,
          message: 'O cliente informado não existe e não possui uma wishlist.'
        })
      })
    })
  })
})