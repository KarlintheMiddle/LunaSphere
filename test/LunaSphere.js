var LunaSphere = artifacts.require('./LunaSphere.sol')

contract('LunaSphere', function (accounts) {
  it('set the total supply upon deployment', function () {
    return LunaSphere.deployed()
      .then(function (instance) {
        tokenInstance = instance
        return tokenInstance.totalSupply()
      })
      .then(function (totalSupply) {
        assert.equal(
          totalSupply.toNumber(),
          1000000,
          'sets the total supply to 1000000',
        )
      })
  })
})
