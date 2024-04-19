// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Errors.sol";


/// @title Real estate App storage structure .
/// @author Includes all the essential state variables, structs, and enums required for the real estate contract.
library LibAppStorage {
    struct PurchaseAgreement {
        uint id;
        address initiator;
        address buyer;
        uint estateId;
        uint signersCount;
        bool executed;
        address[] validSigners;
    }
    struct Proposal {
        address from;
        uint estateId;
        uint price;
    }
    struct Listing {
        uint id;
        address owner;
        string country;
        string state;
        string city;
        string estateAddress;
        uint24 postalCode;
        string description;
        uint256 price;
        string images;
        uint tokenId;
        uint256 createdAt;
    }

    struct Stake {
        address user;
        uint amount;
    }

    struct Holdings {
        address user;
        uint[] tokens;
    }

    enum TransactionType {
        Buy,
        Sell
    }

    struct TransactionHistory {
        uint timestamp;
        uint tokenId;
        uint amount;
        address by;
        TransactionType type_;
        string description;
    }

    struct Market {
        uint tokenId;
        uint currentPrice;
        address[] stakeHolders;
    }

    struct Layout {
        address owner;
        address erc20Token;
        address erc1155Token;
        Market[] market;
        Listing[] listings;
        mapping(uint => Listing) listing;
        Proposal[] proposals;
        TransactionHistory[] transactionHistory;
        uint purchaseAgreementCount;
        mapping(uint => mapping(address => bool)) isValidSigner;
        mapping(uint => PurchaseAgreement) purchaseAgreement;
        mapping(uint => mapping(address => bool)) hasSignedPurchaseAgreement;
        mapping(address => Stake) stake;
        mapping(address => Holdings) holdings;
    }

    function layoutStorage() internal pure returns (Layout storage l) {
        assembly {
            l.slot := 0
        }
    }
}
