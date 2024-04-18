// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

library ERRORS {
    error UNAUTHORIZED();
    error INVALID_SIGNERS_COUNT();
    error NOT_A_VALID_SIGNER();
    error INVALID_ENTITIES();
    error ALREADY_SIGNED();
    error ALREADY_EXECUTED();
}
