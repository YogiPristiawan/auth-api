const ClientError = require('../ClientError')

describe('ClientError', () => {
  it('Should throw eror when directly use it', () => {
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class')
  })
})
