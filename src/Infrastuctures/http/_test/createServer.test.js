const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /users', () => {
    it('Should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'yogi',
        password: 'password',
        fullname: 'Yogi Pristiawan',
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedUser).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Yogi Pristiawan',
        password: 'password',
      }
      const server = await createServer(container)
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'yogi',
        password: 'password',
        fullname: ['Yogi Pristiawan'],
      }
      const server = await createServer(container)
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai')
    })
    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'yogiyogiaiefoaoiwriueroajoajeajoejaoeroiaeuoiaeoidjaoejoawjeofjwaofjoewajfowjeruaowejfjaoei',
        password: 'password',
        fullname: 'Yogi Pristiawan',
      }
      const server = await createServer(container)
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit')
    })
    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'yogi Pristiawan',
        password: 'password',
        fullname: 'Yogi Pristiawan',
      }
      const server = await createServer(container)
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang')
    })
    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'yogi' })
      const requestPayload = {
        username: 'yogi',
        fullname: 'Yogi Pristiawn',
        password: 'password',
      }
      const server = await createServer(container)
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username tidak tersedia')
    })
  })

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'yogi',
      fullname: 'Yogi Pristiawan',
      password: 'password',
    }
    const server = await createServer({}) // fake container
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    })
    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami')
  })
})
