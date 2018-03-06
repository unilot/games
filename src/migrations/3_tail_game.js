var UnilotPrizeCalculator = artifacts.require("UnilotPrizeCalculator");
var UnilotTailEther = artifacts.require("UnilotTailEther");

module.exports = function(deployer) {
  var betAmount = 3100000000000000;

  deployer.deploy(UnilotTailEther, betAmount, UnilotPrizeCalculator.address);
};
