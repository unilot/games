var UnilotPrizeCalculator = artifacts.require('UnilotPrizeCalculator');
var UnilotTailEther = artifacts.require('UnilotTailEther');

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
        var gameContract;
        //0.0031 ether

        return UnilotPrizeCalculator.deployed().then(function(instance) {
            calculatorContract = instance;

            return UnilotTailEther.new(betAmount, calculatorContract.address);
        }).then(function(instance) {
            gameContract = instance;

            return gameContract.getState.call();
        }).then(function (gameState) {
            return assert.equal(state.ACTIVE, gameState.valueOf(), 'Game should be active from start');
        }).then(function () {
            var result;

            for (var i = 1; i <= 5; i++) {
                result = gameContract.sendTransaction({
                    from: accounts[i],
                    value: betAmount
                })
            }

            return result;
        }).then(function () {
            return gameContract.getStat();
        }).then(function (stat) {
            var numPlayers = stat[0].valueOf();
            var prizeAmount = stat[1].valueOf();
            var numWinners = stat[2].valueOf();

            assert.equal(5, numPlayers, '5 players participated');
            assert.equal(web3.toWei(0.0124, 'ether'), prizeAmount, 'Prize amount should be 0.0124 ether');
            return assert.equal(1, numWinners, 'Should be 1 winner')
        }).then(function () {
            gameContract.finish();
        });
    });


    it('Check canceled game flow', function () {
        var calculatorContract;
        var gameContract;

        var playerIndex = 1;
        var startBalance = {};
        var accountTx = {};
        var gameNumPlayers = 5;

        return UnilotPrizeCalculator.deployed().then(function (instance) {
            calculatorContract = instance;

            return UnilotTailEther.new(betAmount, calculatorContract.address);
        }).then(function (instance) {
            gameContract = instance;

            return gameContract.getState.call();
        }).then(function (gameState) {
            return assert.equal(state.ACTIVE, gameState.valueOf(), 'Game should be active from start');
        }).then(function () {
            startBalance[accounts[playerIndex]] = parseInt(web3.eth.getBalance(accounts[playerIndex]));

            return gameContract.sendTransaction({
                from: accounts[playerIndex],
                value: betAmount,
                gasPrice: gasPrice
            });
        }).then(function (tx) {
            accountTx[accounts[playerIndex]] = tx;
        }).then(function () {
            playerIndex++;
            startBalance[accounts[playerIndex]] = parseInt(web3.eth.getBalance(accounts[playerIndex]));

            return gameContract.sendTransaction({
                from: accounts[playerIndex],
                value: betAmount,
                gasPrice: gasPrice
            });
        }).then(function (tx) {
            accountTx[accounts[playerIndex]] = tx;
        }).then(function () {
            playerIndex++;
            startBalance[accounts[playerIndex]] = parseInt(web3.eth.getBalance(accounts[playerIndex]));

            return gameContract.sendTransaction({
                from: accounts[playerIndex],
                value: betAmount,
                gasPrice: gasPrice
            });
        }).then(function (tx) {
            accountTx[accounts[playerIndex]] = tx;
        }).then(function () {
            playerIndex++;
            startBalance[accounts[playerIndex]] = parseInt(web3.eth.getBalance(accounts[playerIndex]));

            return gameContract.sendTransaction({
                from: accounts[playerIndex],
                value: betAmount,
                gasPrice: gasPrice
            });
        }).then(function (tx) {
            accountTx[accounts[playerIndex]] = tx;
        }).then(function () {
            playerIndex++;
            startBalance[accounts[playerIndex]] = parseInt(web3.eth.getBalance(accounts[playerIndex]));

            return gameContract.sendTransaction({
                from: accounts[playerIndex],
                value: betAmount,
                gasPrice: gasPrice
            });
        }).then(function (tx) {
            accountTx[accounts[playerIndex]] = tx;
        }).then(function () {
            return gameContract.getStat();
        }).then(function (stat) {
            var numPlayers = stat[0].valueOf();
            var prizeAmount = stat[1].valueOf();
            var numWinners = stat[2].valueOf();

            assert.equal(gameNumPlayers, numPlayers, '5 players participated');
            assert.equal(web3.toWei(0.0124, 'ether'), prizeAmount, 'Prize amount should be 0.0124 ether');
            assert.equal(1, numWinners, 'Should be 1 winner');
        }).then(function () {
            return gameContract.revoke();
        }).then(function (tx) {
            //I know that line below looks useless. But for some reason if interaction with
            //transaction object doesn't happen accounts balance is not updating and test fails
            //as ether wasn't return but manual tests show that transaction works correctly.
            tx.receipt;

            for (var i = 1; i <= gameNumPlayers; i++) {
                var etalon = startBalance[accounts[i]] - ( accountTx[accounts[i]].receipt.gasUsed * gasPrice );

                assert.equal(etalon, parseInt(web3.eth.getBalance(accounts[i]).valueOf()),
                    'Bet amount should be returned after revoke');
            }
        });
    });
});
