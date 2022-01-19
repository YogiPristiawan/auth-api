const UsersTableTestHelper = require('../../../../test/UsersTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser')
const pool = require('../../database/postgres/pool')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyAvailableUsername function', () => {
    it('Should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'yogi',
      })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('yogi')).rejects.toThrowError(InvariantError)
    })

    it('Should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('yogi')).resolves.not.toThrowError(InvariantError)
    })

    describe('addUser function', () => {
      it('Should persist register user', async () => {
        // Arrange
        const registerUser = new RegisterUser({
          username: 'yogi',
          password: 'secret_password',
          fullname: 'Yogi Pristiawan',
        })
        const fakeIdGenerator = () => '7e52e788-d9a2-4a5b-9741-727e435344dc'
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

        // Action
        await userRepositoryPostgres.addUser(registerUser)

        // Assert
        const users = await UsersTableTestHelper.findUsersById('7e52e788-d9a2-4a5b-9741-727e435344dc')
        expect(users).toHaveLength(1)
      })

      it('Should return registered user correctly', async () => {
        // Arrange
        const registerUser = new RegisterUser({
          username: 'yogi',
          password: 'password',
          fullname: 'Yogi Pristiawan',
        })
        const fakeIdGenerator = () => '7e52e788-d9a2-4a5b-9741-727e435344dc'
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

        // Action
        const registeredUser = await userRepositoryPostgres.addUser(registerUser)

        // Assert
        expect(registeredUser).toStrictEqual(new RegisteredUser({
          id: '7e52e788-d9a2-4a5b-9741-727e435344dc',
          username: 'yogi',
          fullname: 'Yogi Pristiawan',
        }))
      })
    })
  })
})
