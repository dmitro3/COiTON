// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

/// @title Events
/// @author This library includes the event emitted for the real estate contract.

library EVENTS {
    // The event records the owner associated with newly created real estate listings.
    event CreatedListing(
        address indexed owner,
        uint indexed tokenId,
        uint indexed price
    );
    //The `NewProposal` event records the submission of new proposals for real estate transactions.
    event NewProposal(
        address indexed from,
        uint indexed estateId,
        uint indexed price
    );
    //The `PurchaseAgreementInitialization` event logs the start of a purchase agreement for a real estate transaction.
    event PurchaseAgreementInitialization(
        uint indexed estateId,
        address indexed initiator,
        address[] indexed signers
    );

// The Stake event logs the Agent or house owner who stake before listing.
    event Stake(
        address indexed user, 
        uint indexed amount
        );
// The BuyShares event logs the transactions of traders who purchase specific amounts of shares from the real estate trading index.
    event BuyShares(
        address indexed user,
        uint indexed amount,
        uint8 indexed shares
    );
// The SellShares event tracks the sellers who have sold specific amounts of shares from the real estate trading index.
    event SellShares(
        address indexed user,
        uint indexed amount,
        uint8 indexed shares
    );

// The ListingQueuedForApproval event track the listing that needs to be approved.
    event ListingQueuedForApproval(
    string indexed id, 
    bytes32 indexed hash,
    address indexed approver
    );
   
   //The HashCompute event track the computed hash for the real estate listing.
   event HashCompute(
    address owner,
    bytes32 hash
   );

   // The CreateAdministration event logs the creation of a new DAO administration of a particular state.
    event AdministrationCreated(
        address indexed adminSuperior,
        string indexed state,
        string indexed region
    );
// The addAgent event logs the addition of an agent to the system.
    event AgentResgistered(
        string state,
        Agent agent
    );
// The ApproveListing event logs the approval of a real estate listing by the agent.
    event ListingApproved(
        string state,
        uint assignedId,
        string listingId
    );
}
