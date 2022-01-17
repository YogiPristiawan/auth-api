const InvariantError = require('../InvariantError')

describe('InvariantError', () => {
  it('Should create an error correctly', () => {
    const invariantError = new InvariantError('an error ocurs')

    expect(invariantError.statusCode).toEqual(400)
    expect(invariantError.message).toEqual('an error ocurs')
    expect(invariantError.name).toEqual('InvariantError')
  })
})
