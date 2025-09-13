// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Контракт Ownable (владение)
contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}

// Контракт DonationBox наследует логику владения
contract DonationBox is Ownable {
    // Суммарные пожертвования в wei
    uint public totalDonations;

    // События
    event DonationReceived(address indexed donor, uint amount);
    event FundsWithdrawn(address indexed recipient, uint amount);

    // Приём пожертвований
    function donate() external payable {
        require(msg.value > 0, "Donation amount must be greater than zero.");
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    // Вывод всех средств только владельцем
    function withdraw() external onlyOwner {
        require(totalDonations > 0, "There are no money to withdraw.");
        uint amountToWithdraw = totalDonations;
        totalDonations = 0;
        payable(owner).transfer(amountToWithdraw);
        emit FundsWithdrawn(owner, amountToWithdraw);
    }

    // Баланс контракта
    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }
}
