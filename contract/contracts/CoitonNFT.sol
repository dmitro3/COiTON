// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CoitonNFT is ERC721URIStorage {
    constructor() ERC721("CoitonNFT", "CTN") {}

    function mint(address _to, uint256 _tokenId, string calldata _uri) external {
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _uri);
    }
}
