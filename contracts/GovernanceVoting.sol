// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GovernanceVoting is Ownable {
    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        address proposer;
    }
    
    IERC20 public digiKoin;
    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, string description, address proposer);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);

    constructor(address _digiKoin) Ownable(msg.sender) {
        digiKoin = IERC20(_digiKoin);
    }

    function createProposal(string memory _description, uint256 _duration) external {
        require(digiKoin.balanceOf(msg.sender) > 0, "Only token holders can create proposals");
        uint256 proposalId = proposals.length;
        proposals.push(Proposal({
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + _duration,
            executed: false,
            proposer: msg.sender
        }));
        emit ProposalCreated(proposalId, _description, msg.sender);
    }

    function vote(uint256 _proposalId, bool support) external {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        uint256 votingPower = digiKoin.balanceOf(msg.sender);
        require(votingPower > 0, "No voting power");
        
        if (support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }
        hasVoted[_proposalId][msg.sender] = true;
        emit Voted(_proposalId, msg.sender, support, votingPower);
    }

    function executeProposal(uint256 _proposalId) external onlyOwner {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.deadline, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        
        bool passed = proposal.votesFor > proposal.votesAgainst;
        proposal.executed = true;
        emit ProposalExecuted(_proposalId, passed);
    }
    
    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        return proposals[_proposalId];
    }
}
