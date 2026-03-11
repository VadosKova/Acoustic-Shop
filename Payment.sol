// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Payment {
    address public owner;

    event PaymentReceived(address indexed from, uint256 amount);

    constructor() payable {
        owner = msg.sender;
    }

    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner, "Not owner");

        (bool ok, ) = payable(owner).call{value: address(this).balance}("");
        require(ok, "Transfer failed");
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}