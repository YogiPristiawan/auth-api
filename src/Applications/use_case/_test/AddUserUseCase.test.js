const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser')
const UserRepository = require('../../../Domains/users/UserRepository')
const PasswordHash = require('../../security/PasswordHash')
const AddUserUseCase = require('../AddUserUseCase')

describe('AddUserUseCase', () => {
  it('Should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'yogi',
      password: 'password',
      fullname: 'Yogi Pristiawan',
    }
    const expectedRegisteredUser = new RegisteredUser({
      id: 'e3cbd64e-41f5-414e-9d2e-9cea712dca01',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    })

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredUser))

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    })

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload)

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser)
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    }))
  })
})
