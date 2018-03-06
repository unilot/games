pragma solidity ^0.4.16;

import './abstract/BaseUnilotGame.sol';


contract UnilotTailEther is BaseUnilotGame {

    uint64 winnerIndex;

    //Public methods
    function UnilotTailEther(uint betAmount, address calculatorContractAddress)
        public
    {
        state = State.ACTIVE;
        administrator = msg.sender;
        bet = betAmount;

        calculator = UnilotPrizeCalculator(calculatorContractAddress);

        GameStarted(betAmount);
    }

    function getWinners()
        public
        view
        finishedGame
        returns(address[] memory players, uint[] memory prizes)
    {
        var(numWinners, numFixedAmountWinners) = getNumWinners();
        uint totalNumWinners = numWinners + numFixedAmountWinners;

        players = new address[](totalNumWinners);
        prizes = new uint[](totalNumWinners);

        uint index;

        for (uint i = 0; i < totalNumWinners; i++) {
            if ( i > winnerIndex ) {
                index = ( ( players.length ) - ( i - winnerIndex ) );
            } else {
                index = ( winnerIndex - i );
            }

            players[i] = ticketIndex[index];
            prizes[i] = tickets[players[i]].prize;
        }

        return (players, prizes);
    }

    function ()
        public
        payable
        validBet
        onlyPlayer
    {
        require(tickets[msg.sender].block_number == 0);
        require(ticketIndex.length <= 1000);

        tickets[msg.sender].block_number = uint40(block.number);
        tickets[msg.sender].block_time   = uint32(block.timestamp);

        ticketIndex.push(msg.sender);

        NewPlayerAdded(ticketIndex.length, getPrizeAmount());
    }

    function finish()
        public
        onlyAdministrator
        activeGame
    {
        uint64 max_votes;
        uint64[] memory num_votes = new uint64[](ticketIndex.length);

        for (uint i = 0; i < ticketIndex.length; i++) {
            TicketLib.Ticket memory ticket = tickets[ticketIndex[i]];
            uint64 vote = uint64( ( ( ticket.block_number * ticket.block_time ) + uint( ticketIndex[i]) ) % ticketIndex.length );

            num_votes[vote] += 1;

            if ( num_votes[vote] > max_votes ) {
                max_votes = num_votes[vote];
                winnerIndex = vote;
            }
        }

        uint[] memory prizes = calcaultePrizes();

        uint lastId = winnerIndex;

        for ( i = 0; i < prizes.length; i++ ) {
            tickets[ticketIndex[lastId]].prize = prizes[i];
            ticketIndex[lastId].transfer(prizes[i]);

            if ( lastId <= 0 ) {
                lastId = ticketIndex.length;
            }

            lastId -= 1;
        }

        administrator.transfer(this.balance);

        state = State.ENDED;

        GameFinished(ticketIndex[winnerIndex]);
    }
}

