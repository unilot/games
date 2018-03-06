var UnilotPrizeCalculator = artifacts.require('UnilotPrizeCalculator');
var UnilotTailEther = artifacts.require('UnilotTailEther');
var UnilotBonusTailEther = artifacts.require('UnilotBonusTailEther');

contract('UnilotToken', function (accounts) {
    var EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
    var coinbase = web3.eth.coinbase;
    var betAmount = 3100000000000000;
    var gasPrice = 20000000000;
    var state = {
        ACTIVE: 0,
        ENDED: 1,
        REVOKING: 2,
        REVOKED: 3,
        MOVED: 4
    };

    it('Check normal game flow', function() {
        var calculatorContract;
        var games = [];
        var bonusGame;
        var numPlayers = 6;

        return UnilotPrizeCalculator.deployed().then(function(instance) {
            calculatorContract = instance;

            return UnilotTailEther.new(betAmount, calculatorContract.address);
        }).then(function (game) {
            games.push(game);

            return UnilotTailEther.new(betAmount, calculatorContract.address);
        }).then(function (game) {
            games.push(game);

            return UnilotTailEther.new(betAmount, calculatorContract.address);
        }).then(function (game) {
            games.push(game);

            return UnilotTailEther.new(betAmount, calculatorContract.address);
        }).then(function (game) {
            games.push(game);

            return UnilotTailEther.new(betAmount, calculatorContract.address);
        }).then(function (game) {
            games.push(game);

            for (var i = 0; i < games.length; i++) {
                for(var j = 0; j < numPlayers; j++) {
                    games[i].sendTransaction({
                        from: accounts[1+(i*numPlayers)+j],
                        value: betAmount
                    });
                }
            }
        }).then(function () {
            return games[0].finish();
        }).then(function () {
            return games[1].finish();
        }).then(function () {
            return games[2].finish();
        }).then(function () {
            return games[3].finish();
        }).then(function () {
            return games[4].finish();
        }).then(function () {
            return UnilotBonusTailEther.new(calculatorContract.address, {
                value: web3.toWei(1, 'ether')
            })
        }).then(function (instance) {
            bonusGame = instance;

            for (var i = 0; i < games.length; i++) {
                var players = [];

                for(var j = 0; j < numPlayers; j++) {
                    players.push(accounts[1+(i*numPlayers)+j]);
                }

                bonusGame.importPlayers(games[i].address, players);
            }
        }).then(function () {
            return bonusGame.getPrizeAmount.call()
        }).then(function (prizeAmount) {
            return assert.equal(web3.toWei(1, 'ether'), prizeAmount.valueOf(),
                'Prize amount should be 1 ether');
        }).then(function () {
            return bonusGame.finish()
        }).then(function (tx) {
            return bonusGame.getWinners.call();
        }).then(function (winners) {
            var _winners = winners[0];
            var _prizes = winners[1];

            for (var i = 0; i < _winners.length; i++) {
                console.log(_winners[i].valueOf());
                console.log(_prizes[i].valueOf());
                console.log('-----//-----');
            }
        });
    });
});
