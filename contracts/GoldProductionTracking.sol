// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GoldProductionTracking is Ownable {
    struct ProductionRecord {
        uint256 timestamp;
        uint256 goldProduced; // Amount in grams
    }

    // Mapping to store production records by day
    mapping(uint256 => ProductionRecord) public productionRecords;
    uint256 public totalGoldProduced;
    
    // Authorized IoT devices
    mapping(address => bool) public authorizedDevices;

    // Events
    event GoldProduced(uint256 indexed timestamp, uint256 amount);
    event DeviceAuthorized(address indexed device, bool status);

    constructor(address owner) Ownable(owner) {}

    /**
     * @notice Authorize or revoke an IoT device
     * @param device The address of the IoT device
     * @param status True to authorize, false to revoke
     */
    function setDeviceAuthorization(address device, bool status) external onlyOwner {
        authorizedDevices[device] = status;
        emit DeviceAuthorized(device, status);
    }

    /**
     * @notice Record gold production from IoT data
     * @param goldAmount The amount of gold produced in grams
     */
    function recordProduction(uint256 goldAmount) external {
        require(authorizedDevices[msg.sender], "Unauthorized device");
        require(goldAmount > 0, "Invalid gold amount");

        uint256 currentDay = block.timestamp / 1 days;
        productionRecords[currentDay] = ProductionRecord(block.timestamp, goldAmount);
        totalGoldProduced += goldAmount;
        
        emit GoldProduced(block.timestamp, goldAmount);
    }

    /**
     * @notice Get gold production for a specific day
     * @param dayTimestamp The day timestamp (use block.timestamp / 1 days)
     * @return timestamp and goldProduced
     */
    function getProduction(uint256 dayTimestamp) external view returns (uint256, uint256) {
        ProductionRecord memory record = productionRecords[dayTimestamp];
        return (record.timestamp, record.goldProduced);
    }
}
