// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAPI {
    function requestVolumeData(
        string calldata id,
        string calldata share,
        string calldata price
    ) external returns (bytes32 requestId);

    function getStats() external returns (bytes32 requestId);
}
