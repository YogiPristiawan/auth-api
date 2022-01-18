const RegisteredUser = require('../RegisteredUser')

describe('A RegisteredUser entities', () => {
  it('Should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'yogi',
      fullname: 'Yogi Pristiawan',
    }

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('Should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'yogi',
      fullname: 'Yogi Pristiawan',
    }

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('Should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: '2e67e653-ce86-458d-815d-ed01984d1484',
      username: 'yogi',
      fullname: 'Yogi Pristiawan',
    }

    // Action
    const registeredUser = new RegisteredUser(payload)

    // Assert
    expect(registeredUser.id).toEqual(payload.id)
    expect(registeredUser.username).toEqual(payload.username)
    expect(registeredUser.fullname).toEqual(payload.fullname)
  })
})
