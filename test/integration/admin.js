const chai = require('chai')
const chaiSubset = require('chai-subset')
const db = require('../../src/database/models')
const adminController = require('../../src/controllers/admin')
const { errorHandler } = require('../../src/middlewares/error-handler')
const { expect } = chai

chai.use(chaiSubset)

const next = res => error => errorHandler(error, res)

describe('Testing Admin routes', () => {
  let mockRes = {
    status: () => ({ send: a => a, json: b => b })
  }

  after(() => db.AdminUsers.destroy({
    where: {},
    truncate: true
  }))

  describe('POST /admin', () => {
    let { adminPost } = adminController
    let mockReq

    before(async () => {
      mockReq = (name, email, password) => ({
        body: {
          name,
          email,
          password
        }
      })

      await db.AdminUsers.create({
        name: 'Alice',
        email: 'alice@gmail.com',
        encryptedPassword: '$2a$1jCTOQoU./Aj1.wKcQTTc23zvIiiJblgU7QQQFwG'
      })
    })

    it('should throw an error when sending an email that is already in use', async () => {
      const result = await adminPost(
        mockReq('Alice Silva', 'alice@gmail.com', '123123:)'),
        mockRes,
        next(mockRes)
      )

      expect(result.error).to.containSubset({
        message: 'Já existe cadastro vinculado ao email informado.',
        statusCode: 409
      })
    })

    it('should create an admin successfuly when providing an email that\'s not already in use', async () => {
      const result = await adminPost(
        mockReq('Alice Silva', 'alice.silva@gmail.com', '123123:)'),
        mockRes,
        next(mockRes)
      )

      expect(result).to.have.property('name', 'Alice Silva')
      expect(result).to.have.property('email', 'alice.silva@gmail.com')
      expect(result).to.have.property('token')
      expect(result).to.not.have.property('password')
      expect(result).to.not.have.property('encryptedPassword')
    })
  })

  describe('Testing /admin/authenticate', () => {
    describe('POST /admin/authenticate', () => {
      let { authPost } = adminController
      let mockReq
  
      before(() => {
        mockReq = (email, password) => ({
          body: {
            email,
            password
          }
        })
      })
  
      it('should authenticate successfully when email and password are correct', async () => {
        const result = await authPost(
          mockReq('alice.silva@gmail.com', '123123:)'),
          mockRes,
          next(mockRes)
        )

        expect(result.token.split('.')).to.have.lengthOf(3)
      })

      it('should fail authentication when password is wrong', async () => {
        const result = await authPost(
          mockReq('alice.silva@gmail.com', 'ilovecats'),
          mockRes,
          next(mockRes)
        )

        expect(result.error).to.containSubset({
          statusCode: 400,
          message: 'A senha informada está incorreta.'
        })
      })

      it('should fail authentication when email doesn\'t belong any admin user', async () => {
        const result = await authPost(
          mockReq('duda@gmail.com', '123123:)'),
          mockRes,
          next(mockRes)
        )

        expect(result.error).to.containSubset({
          statusCode: 404,
          message: 'Usuário admin não encontrado.'
        })
      })
    })
  })
})