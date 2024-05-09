// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/LibAppStorage.sol";

interface IDao {
    function getListings() external view returns (LibAppStorage.Listing[] memory);
}
