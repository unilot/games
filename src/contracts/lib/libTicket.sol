pragma solidity ^0.4.16;


library TicketLib {
    struct Ticket {
        uint40 block_number;
        uint32 block_time;
        uint prize;
    }
}
