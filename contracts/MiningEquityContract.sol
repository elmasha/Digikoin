// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MiningEquityContract is Ownable {
    IERC20 public digiKoin;

    struct Investor {
        uint256 equityShare;
        uint256 dividendsEarned;
    }

    mapping(address => Investor) public investors;
    uint256 public totalEquity;
    uint256 public totalDividends;

    event EquityPurchased(address indexed investor, uint256 amount);
    event DividendsDistributed(uint256 totalAmount);
    event DividendClaimed(address indexed investor, uint256 amount);
    event EquityTransferred(address indexed from, address indexed to, uint256 amount);

    constructor(address _digiKoin) {
        digiKoin = IERC20(_digiKoin);
    }

    function purchaseEquity(uint256 amount) external {
        require(digiKoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        investors[msg.sender].equityShare += amount;
        totalEquity += amount;
        emit EquityPurchased(msg.sender, amount);
    }

    function distributeDividends(uint256 totalAmount) external onlyOwner {
        require(totalAmount > 0, "Dividend must be greater than 0");
        require(totalEquity > 0, "No equity holders available");
        
        totalDividends += totalAmount;
        emit DividendsDistributed(totalAmount);
    }

    function claimDividend() external {
        uint256 owed = (investors[msg.sender].equityShare * totalDividends) / totalEquity;
        require(owed > 0, "No dividends owed");
        payable(msg.sender).transfer(owed);
        investors[msg.sender].dividendsEarned += owed;
        emit DividendClaimed(msg.sender, owed);
    }

    function transferEquity(address to, uint256 amount) external {
        require(investors[msg.sender].equityShare >= amount, "Insufficient equity");
        investors[msg.sender].equityShare -= amount;
        investors[to].equityShare += amount;
        emit EquityTransferred(msg.sender, to, amount);
    }

    receive() external payable {}
}
