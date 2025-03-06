// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AdminManagement is Ownable {
    mapping(address => bool) public admins;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner(), "Not an admin");
        _;
    }

    /**
     * @notice Add a new admin (Only Owner can call)
     * @param admin Address of the new admin
     */
    function addAdmin(address admin) external onlyOwner {
        require(!admins[admin], "Already an admin");
        admins[admin] = true;
        emit AdminAdded(admin);
    }

    /**
     * @notice Remove an existing admin (Only Owner can call)
     * @param admin Address of the admin to remove
     */
    function removeAdmin(address admin) external onlyOwner {
        require(admins[admin], "Not an admin");
        admins[admin] = false;
        emit AdminRemoved(admin);
    }

    /**
     * @notice Check if an address is an admin
     * @param user Address to check
     * @return bool True if the user is an admin
     */
    function isAdmin(address user) external view returns (bool) {
        return admins[user];
    }
}
