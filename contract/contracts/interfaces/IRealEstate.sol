// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRealEstate {
    // function queListingForApproval(
    //     string memory id,
    //     bytes32 hash,
    //     address agent
    // ) external;

     function queListingForApproval(
        string memory id,
        bytes32 hash,
        address approver
    ) external ;

    // function approveListing(
    //     string memory id,
    //     bytes32 hash,
    //     address owner
    // ) external;

    function createListing(
        string memory id,
        address owner,
        address agent,
        string memory region,
        uint24 postalCode,
        string memory description,
        uint256 price,
        string memory images,
        string memory coverImage
    ) external;
}
