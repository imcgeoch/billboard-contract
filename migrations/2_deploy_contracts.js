var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Billboard = artifacts.require("./Billboard.sol");


module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
	deployer.deploy(Billboard);
};
