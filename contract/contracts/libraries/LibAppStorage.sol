// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Real estate App storage structure .
/// @author Includes all the essential state variables, structs, and enums required for the real estate contract.
library LibAppStorage {
    struct PurchaseAgreement {
        uint256 id;
        address initiator;
        address buyer;
        uint256 estateId;
        uint256 signersCount;
        bool executed;
        address[] validSigners;
    }

    struct Proposal {
        address from;
        uint256 estateId;
        uint256 price;
    }

    struct Listing {
        string id;
        address owner;
        string region;
        uint24 postalCode;
        string description;
        uint256 price;
        string images;
        uint256 tokenId;
        string coverImage;
        uint256 createdAt;
    }

    // struct Stake {
    //     address user;
    //     uint amount;
    // }

    struct TokenHolding {
        uint256 percent;
        uint256 tokenId;
    }

    struct StakeHolder {
        address user;
        uint256 price;
        uint256 percentageShare;
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
        uint256 timestamp;
        uint256 tokenId;
        uint256 amount;
        address by;
        TransactionType type_;
        string description;
    }

    struct Market {
        uint256 tokenId;
        uint256 currentPrice;
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
        mapping(uint256 => Market) market;
        mapping(address => mapping(uint256 => uint8)) userMarketShare;
        Listing[] listings;
        mapping(uint256 => Listing) listing;
        mapping(string => ListingApproval) listingApproval;
        Proposal[] proposals;
        TransactionHistory[] transactionHistory;
        uint256 purchaseAgreementCount;
        mapping(uint256 => mapping(address => bool)) isValidSigner;
        mapping(uint256 => PurchaseAgreement) purchaseAgreement;
        mapping(uint256 => mapping(address => bool)) hasSignedPurchaseAgreement;
        mapping(address => uint256) stake;
        mapping(address => Holdings) holdings;
    }

    function layoutStorage() internal pure returns (Layout storage l) {
        assembly {
            l.slot := 0
        }
    }
}
