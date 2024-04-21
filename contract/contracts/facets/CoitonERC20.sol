// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";



// contract CoitonToken is ERC20("CoitonToken", "CT"), ERC20Burnable {

//     function mint(address to, uint256 amount) public  {
//         _mint(to, amount); // last value is for decimals
//     }

//     function decimals() override public pure returns (uint8) {
//         return 0;
//     }

//     function getBalance() external view returns (uint256) {
//         return this.balanceOf(msg.sender);
//     }

//     function transferTokens(address _receiver, uint256 _value) external {
//         require(balanceOf(msg.sender) >= _value, "You do not have enough Coiton Tokens");
//         approve(msg.sender, _value);
//         transferFrom(msg.sender, _receiver, _value);
//     }

//     function burnTokens(uint256 _value) external {
//         require(balanceOf(msg.sender) >= _value, "You do not have enough Coiton Tokens");
//         burn(_value);
//     }

    
// }