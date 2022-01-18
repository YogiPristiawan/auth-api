const RegisterUser = require('../RegisterUser')

describe('a RegisterUser entities', () => {
  it('Should throw erro when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: 'abc',
    }

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('Should throw error when payload did not meet data type specifitaion', () => {
    // Arrange
    const payload = {
      username: 123,
      fullname: true,
      password: 'abc',
    }

    // Action and Assert
    expect(() => new RegisterUser(payload).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('Should throw error when username contains more than 50 characters', () => {
    // Arrange
    const payload = {
      username: 'abcdefghijklmnopqrstuvwxyz1234567890987654321zyxwvutsrqponmlkjihgfedcba',
      fullname: 'Yogi Pristiawan',
      password: 'abc',
    }

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR')
  })

  it('Should throw error when username contains restricted character', () => {
    // Arrange
    const payload = {
      username: 'yo gi',
      fullname: 'Yogi Pristiawan',
      password: 'abc',
    }

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
  })

  it('Should create registerUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'yogi',
      fullname: 'Yogi Pristiawan',
      password: 'abc',
    }

    // Action
    const { username, fullname, password } = new RegisterUser(payload)

    // Assert
    expect(username).toEqual(payload.username)
    expect(fullname).toEqual(payload.fullname)
    expect(password).toEqual(payload.password)
  })
})
