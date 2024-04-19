// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    struct Market {
        uint tokenId;
        uint currentPrice;
        uint8 consumedShares;
        StakeHolder[] stakeHolders;
    }

    struct Layout {
        address owner;
        address erc20Token;
        address erc1155Token;
        mapping(uint => Market) market;
        mapping(address => mapping(uint => uint8)) userMarketShare;
        Listing[] listings;
        mapping(uint => Listing) listing;
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
