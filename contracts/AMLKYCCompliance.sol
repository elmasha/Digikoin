// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AMLKYCCompliance is Ownable {
    // Mapping of approved users (true = KYC verified)
    mapping(address => bool) public verifiedUsers;

    // Blacklisted addresses (true = blacklisted)
    mapping(address => bool) public blacklistedUsers;

    // Event logs
    event UserVerified(address indexed user);
    event UserBlacklisted(address indexed user);
    event UserRemovedFromBlacklist(address indexed user);

    /**
     * @notice Verify a user's KYC status (Only Owner can call)
     * @param user Address of the user to verify
     */
    function verifyUser(address user) external onlyOwner {
        require(!verifiedUsers[user], "User already verified");
        require(!blacklistedUsers[user], "User is blacklisted");
        
        verifiedUsers[user] = true;
        emit UserVerified(user);
    }

    /**
     * @notice Blacklist a user (Only Owner can call)
     * @param user Address of the user to blacklist
     */
    function blacklistUser(address user) external onlyOwner {
        require(!blacklistedUsers[user], "User already blacklisted");
        
        blacklistedUsers[user] = true;
        verifiedUsers[user] = false; // Remove verification if blacklisted
        emit UserBlacklisted(user);
    }

    /**
     * @notice Remove a user from the blacklist (Only Owner can call)
     * @param user Address of the user to remove
     */
    function removeFromBlacklist(address user) external onlyOwner {
        require(blacklistedUsers[user], "User is not blacklisted");
        blacklistedUsers[user] = false;
        emit UserRemovedFromBlacklist(user);
    }

    /**
     * @notice Check if a user is allowed to transact
     * @param user Address of the user to check
     */
    function isUserAllowed(address user) external view returns (bool) {
        return verifiedUsers[user] && !blacklistedUsers[user];
    }
}
