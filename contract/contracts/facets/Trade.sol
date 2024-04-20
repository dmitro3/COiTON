// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "../libraries/LibAppStorage.sol";
import "../libraries/Events.sol";
import "../libraries/Errors.sol";

contract Trade {
     //Instantiating a new Layout from the LibAppStorage.
    LibAppStorage.Layout internal l;

    function stake(uint amount) external {
        /// check if contract has allowance to spend erc20 tokens
        l.stake[msg.sender] += amount;
        emit EVENTS.Stake(msg.sender, amount);
    }

    function withdrawStake(uint amount) external view {
        if (amount > 0 && l.stake[msg.sender] >= amount) {
            /// call transfer to erc20 token
        } else {
            revert ERRORS.INSUFFICIENT_BALANCE();
        }
    }


// The function allows users to buy shares of real estate NFT on the trading platform
//@Param tokenId: Identify the certain NFT purchase 
//@param shares: The percentage of shares of the NFT that the user wishes to buy.
//we decided to make it flexible for users to get a fraction of share from the 
//Tradable NFT.
    function buyNFTTokenShares(uint tokenId, uint8 shares) external {
        uint balance = l.stake[msg.sender];
        LibAppStorage.Market storage tokenMarket = l.market[tokenId];
        if (tokenMarket.consumedShares + shares > 100) {
            revert ERRORS.EXHAUSTED_TOKEN_SHARES();
        }
        uint tokenValueAtPercentageShare = calculateTokenValueInShares(
            shares,
            tokenMarket.currentPrice
        );
        if (balance < tokenValueAtPercentageShare) {
            revert ERRORS.INSUFFICIENT_BALANCE();
        }
        l.stake[msg.sender] -= tokenValueAtPercentageShare;
        l.userMarketShare[msg.sender][tokenId] += shares;
        tokenMarket.currentPrice += tokenValueAtPercentageShare;
        tokenMarket.consumedShares += shares;
        LibAppStorage.StakeHolder memory _newStakeHolder = LibAppStorage
            .StakeHolder({
                user: msg.sender,
                percentageShare: shares,
                price: tokenValueAtPercentageShare
            });
        tokenMarket.stakeHolders.push(_newStakeHolder);

        LibAppStorage.TransactionHistory memory _new_transaction = LibAppStorage
            .TransactionHistory({
                timestamp: block.timestamp,
                tokenId: tokenId,
                amount: tokenValueAtPercentageShare,
                by: msg.sender,
                type_: LibAppStorage.TransactionType.Buy,
                description: ""
            });
        l.transactionHistory.push(_new_transaction);

        emit EVENTS.BuyShares(msg.sender, tokenValueAtPercentageShare, shares);
    }


// The function  is designed to allow a user to sell shares of a  (NFT) they own on a decentralized trading platform.
//@Param tokenId: Identify the NFT to be sold.
//@Param  shares: The number of share the user wish to sell 
//We also made it flexible for users to sell any amount of share they wish too. 

    function sellNFTTokenShares(uint tokenId, uint8 shares) external {
        uint userShares = l.userMarketShare[msg.sender][tokenId];
        if (userShares < 1 || userShares < shares) {
            revert ERRORS.INSUFFICIENT_SHARES();
        }
        LibAppStorage.Market storage tokenMarket = l.market[tokenId];
        LibAppStorage.StakeHolder memory lastShareHolder = tokenMarket
            .stakeHolders[tokenMarket.stakeHolders.length - 1];
        uint calculation;
        if (lastShareHolder.user == msg.sender) {
            calculation = calculateTokenValueInShares(
                shares,
                lastShareHolder.price
            );
        } else {
            calculation = calculateTokenValueInShares(
                shares,
                tokenMarket.currentPrice
            );
        }

        LibAppStorage.TransactionHistory memory _new_transaction = LibAppStorage
            .TransactionHistory({
                timestamp: block.timestamp,
                tokenId: tokenId,
                amount: calculation,
                by: msg.sender,
                type_: LibAppStorage.TransactionType.Sell,
                description: ""
            });

        l.transactionHistory.push(_new_transaction);

        l.userMarketShare[msg.sender][tokenId] -= shares;
        l.stake[msg.sender] += calculation;

        tokenMarket.consumedShares -= shares;
        tokenMarket.currentPrice -= calculation;
        emit EVENTS.SellShares(msg.sender, calculation, shares);
    }
// This function is intended to manage the calculations involved in both the buyNFTTokenShares and sellNFTTokenShares functions.
// @Param shares: The number of shares specified by any user for calculation.
// @Param currentPrice: The current price of the real estate NFT as provided.
    function calculateTokenValueInShares(
        uint8 shares,
        uint currentPrice
    ) internal pure returns (uint) {
        uint value = (currentPrice * shares) / 100;
        return value;
    }
}
