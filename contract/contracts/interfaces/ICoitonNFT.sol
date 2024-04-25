// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICoitonNFT {
    function mint(address _to, uint256 _tokenId, string calldata _uri) external;
}
