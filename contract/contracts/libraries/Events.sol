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
}
