var UnilotPrizeCalculator = artifacts.require("UnilotPrizeCalculator");
var UnilotBonusTailToken = artifacts.require("UnilotBonusTailToken");

module.exports = function(deployer) {
    deployer.deploy(UnilotBonusTailToken, UnilotPrizeCalculator.address);
};
