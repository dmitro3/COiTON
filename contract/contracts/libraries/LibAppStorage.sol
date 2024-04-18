// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibAppStorage {
    modifier OnlyOwner() {}
    struct Listing {
        address owner;
        string country;
        string state;
        string city;
        string estateAddress;
        uint24 postalCode;
        string description;
        uint256 price;
        string[] images;
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
        address erc20Token;
        address erc1155Token;
        Market[] market;
        Listing[] listings;
        TransactionHistory[] transactionHistory;
        mapping(address => Stake) stake;
        mapping(address => Holdings) holdings;
    }
}
