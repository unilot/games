var UnilotPrizeCalculator = artifacts.require("UnilotPrizeCalculator");

module.exports = function(deployer) {
  deployer.deploy(UnilotPrizeCalculator);
};
