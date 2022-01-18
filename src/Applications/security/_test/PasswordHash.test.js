const PasswordHash = require('../PasswordHash')

describe('PasswordHash interface', () => {
  it('Should throw error when invoce absctract behavior', async () => {
    // Arrange
    const passwordHash = new PasswordHash()

    // Action and Assert
    await expect(passwordHash.hash('dummy_password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  })
})
