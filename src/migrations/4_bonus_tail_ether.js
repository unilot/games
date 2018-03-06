var UnilotPrizeCalculator = artifacts.require("UnilotPrizeCalculator");
var UnilotBonusTailEther = artifacts.require("UnilotBonusTailEther");

module.exports = function(deployer) {
    deployer.deploy(UnilotBonusTailEther, UnilotPrizeCalculator.address);
};
