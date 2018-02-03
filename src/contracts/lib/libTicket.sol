pragma solidity ^0.4.16;


library TicketLib {
    struct Ticket {
        uint block_number;
        uint block_time;
        uint prize;
    }
}
