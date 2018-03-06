pragma solidity ^0.4.16;

interface Game {
    event GameStarted(uint betAmount);
    event NewPlayerAdded(uint numPlayers, uint prizeAmount);
    event GameFinished(address winner);

    function () public payable;                                   //Participate in game. Proxy for play method
    function getPrizeAmount() public constant returns (uint);     //Get potential or actual prize amount
    function getNumWinners() public constant returns(uint, uint);
    function getPlayers() public constant returns(address[]);           //Get full list of players
    function getWinners() public view returns(address[] memory players,
                                                uint[] memory prizes);  //Get winners. Accessable only when finished
    function getStat() public constant returns(uint, uint, uint);       //Short stat on game

    function calcaultePrizes() public returns (uint[]);

    function finish() public;                        //Closes game chooses winner

    function revoke() public;                        //Stop game and return money to players
    // function move(address nextGame);              //Move players bets to another game
}