const LunaSphere = artifacts.require('LunaSphere')

module.exports = function (deployer) {
  deployer.deploy(LunaSphere, 1000000)
}
