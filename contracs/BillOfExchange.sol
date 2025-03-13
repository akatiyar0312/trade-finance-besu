// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BillOfExchange {
    struct Bill {
        uint id;
        address issuer;
        address drawee;
        uint amount;
        uint dueDate;
        bool accepted;
        bool settled;
    }

    uint public billCounter = 0;
    mapping(uint => Bill) public bills;

    event BillIssued(uint id, address indexed issuer, address indexed drawee, uint amount, uint dueDate);
    event BillAccepted(uint id, address indexed drawee);
    event BillSettled(uint id, address indexed payer);

    function issueBill(address drawee, uint amount, uint dueDate) public {
        billCounter++;
        bills[billCounter] = Bill(billCounter, msg.sender, drawee, amount, dueDate, false, false);
        emit BillIssued(billCounter, msg.sender, drawee, amount, dueDate);
    }

    function acceptBill(uint billId) public {
        require(bills[billId].drawee == msg.sender, "Only the drawee can accept the bill");
        require(!bills[billId].accepted, "Bill already accepted");
        bills[billId].accepted = true;
        emit BillAccepted(billId, msg.sender);
    }

    function settleBill(uint billId) public payable {
        require(bills[billId].accepted, "Bill must be accepted before settlement");
        require(msg.value >= bills[billId].amount, "Insufficient amount to settle bill");
        require(!bills[billId].settled, "Bill already settled");

        payable(bills[billId].issuer).transfer(msg.value);
        bills[billId].settled = true;
        emit BillSettled(billId, msg.sender);
    }
}
