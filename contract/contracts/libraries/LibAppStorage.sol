// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
        string id;
        address owner;
        string region;
        uint24 postalCode;
        string description;
        uint256 price;
        string images;
        uint tokenId;
        string coverImage;
        uint256 createdAt;
    }

    // struct Stake {
    //     address user;
    //     uint amount;
    // }

    struct TokenHolding {
        uint percent;
        uint tokenId;
    }

    struct StakeHolder {
        address user;
        uint price;
        uint percentageShare;
    }

    struct Holdings {
        address user;
        TokenHolding[] holding;
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

    struct MarketReturn {
        Market market;
        Listing listing;
    }

    struct Market {
        uint tokenId;
        uint currentPrice;
        uint8 consumedShares;
        StakeHolder[] stakeHolders;
    }

    struct ListingApproval {
        bytes32 hash;
        address approver;
        bool approved;
        bool created;
    }

    struct Layout {
        address owner;
        // address diamondAddress;
        address erc20Token;
        address erc721Token;
        mapping(uint => Market) market;
        mapping(address => mapping(uint => uint8)) userMarketShare;
        Listing[] listings;
        mapping(uint => Listing) listing;
        mapping(string => ListingApproval) listingApproval;
        Proposal[] proposals;
        TransactionHistory[] transactionHistory;
        uint purchaseAgreementCount;
        mapping(uint => mapping(address => bool)) isValidSigner;
        mapping(uint => PurchaseAgreement) purchaseAgreement;
        mapping(uint => mapping(address => bool)) hasSignedPurchaseAgreement;
        mapping(address => uint) stake;
        mapping(address => Holdings) holdings;
    }

    function layoutStorage() internal pure returns (Layout storage l) {
        assembly {
            l.slot := 0
        }
    }
}
