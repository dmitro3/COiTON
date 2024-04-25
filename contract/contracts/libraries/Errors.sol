// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

/// @title Custom Errors
/// @author This library manages error handling for the real estate contract.

library ERRORS {
    //This error is thrown when a function call is made by a user who does not have the necessary permissions to perform the action.
    error UNAUTHORIZED();
    //This error is triggered when the number of signatories provided does not meet the required or expected count for a valid transaction.
    error INVALID_SIGNERS_COUNT();
    //This error occurs when an attempt is made to perform an action by an entity that is not recognized as a valid signer in the contract.
    error NOT_A_VALID_SIGNER();
    //This error is used when the entities involved in a transaction or an operation do not meet the specified criteria or are malformed.
    error INVALID_ENTITIES();
    //This error indicates that a transaction or document has already been signed by the user, preventing duplicate signatures.
    error ALREADY_SIGNED();
    //This error is thrown when there is an attempt to execute a transaction or operation that has already been completed or finalized.
    error ALREADY_EXECUTED();
    //This error suggests that there are no more shares available for a particular token.
    error EXHAUSTED_TOKEN_SHARES();
    //This error is triggered when an account does not have enough Coiton Token to complete a transaction.
    error INSUFFICIENT_BALANCE();
    //this error occurs when a seller does not have enough shares to complete a transaction they are attempting to make.
    error INSUFFICIENT_SHARES();
    //This error occurs when there is an attempt to approve a listing that has already been approved.
    error LISTING_ALREADY_APPROVED();
    //This error indicates that an action cannot be completed because the listing in question has not yet been approved.
    error LISTING_NOT_APPROVED();
    //This error is triggered when the hash associated with a listing does not match expected values.
    error INVALID_LISTING_HASH();
    //This error means that there is an attempt to create a duplicate listing that already exists.
    error LISTING_ALREADY_CREATED();
    error NO_APPROVAL_TO_SPEND_TOKENS();
}
