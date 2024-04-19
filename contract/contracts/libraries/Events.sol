// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

library EVENTS {
    event CreatedListing(
        address indexed owner,
        uint indexed tokenId,
        uint indexed price
    );

    event NewProposal(
        address indexed from,
        uint indexed estateId,
        uint indexed price
    );

    event PurchaseAgreementInitialization(
        uint indexed estateId,
        address indexed initiator,
        address[] indexed signers
    );

    event Stake(address indexed user, uint indexed amount);

    event BuyShares(
        address indexed user,
        uint indexed amount,
        uint8 indexed shares
    );
    event SellShares(
        address indexed user,
        uint indexed amount,
        uint8 indexed shares
    );
}
