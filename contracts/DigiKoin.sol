// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DigiKoin is ERC20, Ownable {
    uint256 public goldReserves;
    uint256 public totalDividends;
    uint256 public totalEquity;
    uint256 public totalProfitsDistributed;
    mapping(address => uint256) public equityStake;

    event GoldMinted(address indexed recipient, uint256 amountMinted);
    event RedemptionRequested(address indexed user, uint256 amountRequested);
    event DividendsDistributed(uint256 totalAmountDistributed);
    event DividendClaimed(address indexed user, uint256 amountClaimed);
    event TokenTransferred(address indexed from, address indexed to, uint256 amountTransferred);
    event EquityPurchased(address indexed user, uint256 amount);
    event ProfitsDistributed(uint256 amount);
    event EtherReceived(address indexed sender, uint256 amount);

    constructor() ERC20("DigiKoin", "DGK") Ownable(msg.sender) {
        _mint(msg.sender, 10000 * 10 ** decimals()); // Initial supply
    }

    function mintGold(address recipient, uint256 amount) external onlyOwner {
        _mint(recipient, amount);
        goldReserves += amount;
        emit GoldMinted(recipient, amount);
    }

    function redeemGold(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(goldReserves >= amount, "Not enough gold in reserves");
        _burn(msg.sender, amount);
        goldReserves -= amount;
        emit RedemptionRequested(msg.sender, amount);
    }

    function distributeDividends(uint256 totalAmount) public  {
        require(totalAmount > 0, "Dividend must be greater than 0");
        require(totalSupply() > 0, "No tokens in circulation");
        totalDividends += totalAmount;
        emit DividendsDistributed(totalAmount);
    }

    function claimDividend() external {
        uint256 owed = (balanceOf(msg.sender) * totalDividends) / totalSupply();
        require(owed > 0, "No dividends owed");
        totalDividends -= owed;
        payable(msg.sender).transfer(owed);
        emit DividendClaimed(msg.sender, owed);
    }

    function withdrawEther() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdraw failed");
    }

    function buyTokens() external payable {
        require(msg.value > 0, "Must send ETH");
        uint256 amount = msg.value / 0.01 ether;
        _mint(msg.sender, amount);
        goldReserves += amount;
        emit GoldMinted(msg.sender, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        bool success = super.transfer(recipient, amount);
        if (success) {
            emit TokenTransferred(msg.sender, recipient, amount);
        }
        return success;
    }

    function buyEquity() external payable {
        require(msg.value > 0, "Investment must be greater than 0");
        equityStake[msg.sender] += msg.value;
        totalEquity += msg.value;
        emit EquityPurchased(msg.sender, msg.value);
    }

    function distributeProfits() external onlyOwner {
        uint256 profitAmount = address(this).balance;
        require(profitAmount > 0, "No profits available");

        totalProfitsDistributed += profitAmount;
        distributeDividends(profitAmount);  // Now it will be visible
        emit ProfitsDistributed(profitAmount);
    }

    function getTotalEquity() external view returns (uint256) {
        return totalEquity;
    }

    receive() external payable {
        totalDividends += msg.value;
        emit EtherReceived(msg.sender, msg.value);
    }
    
    fallback() external payable { 
    emit EtherReceived(msg.sender, msg.value); // Log unexpected ETH transfers
}

}
