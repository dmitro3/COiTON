// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "../libraries/LibAppStorage.sol";
import "../libraries/Events.sol";
import "../libraries/Errors.sol";
import "../interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Trade {
    //Instantiating a new Layout from the LibAppStorage.
    LibAppStorage.Layout internal l;

    function stake(uint amount) external {
        if (
            IIERC20(l.erc20Token).allowance(
                msg.sender,
                address(l.diamondAddress)
            ) < amount
        ) {
            revert ERRORS.NO_APPROVAL_TO_SPEND_TOKENS();
        }
        /// check if contract has allowance to spend erc20 tokens
        l.stake[msg.sender] += amount;
        IIERC20(l.erc20Token).transferFrom(
            msg.sender,
            address(l.diamondAddress),
            amount
        );
        emit EVENTS.Stake(msg.sender, amount);
    }

    function checkStake(address _user) external view returns (uint) {
        return l.stake[_user];
    }

    function withdrawStake(uint amount) external {
        if (amount > 0 && l.stake[msg.sender] >= amount) {
            IIERC20(l.erc20Token).transfer(msg.sender, amount);
        } else {
            revert ERRORS.INSUFFICIENT_BALANCE();
        }
    }

    function getMarket()
        external
        view
        returns (LibAppStorage.MarketReturn[] memory)
    {
        LibAppStorage.MarketReturn[]
            memory return_ = new LibAppStorage.MarketReturn[](
                l.listings.length
            );
        uint index;
        for (uint i = 1; i < l.listings.length + 1; i++) {
            return_[index] = LibAppStorage.MarketReturn({
                market: l.market[i],
                listing: l.listing[i]
            });
            index++;
        }

        return return_;
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
    ) public pure returns (uint) {
        uint value = (currentPrice * shares) / 100;
        return value;
    }

    function registerUser(
        string calldata name,
        string calldata email,
        bool isDao
    ) public {
        LibAppStorage.UserCredentials storage user = l.users[msg.sender];
        require(user.addr == address(0), "USER_ALREADY_EXIST");
        user.email = email;
        user.addr = msg.sender;
        user.isDao = isDao;
        user.name = name;
        user.isRegistered = true;
    }

    function getUserByAddress(
        address _addr
    ) public view returns (LibAppStorage.UserCredentials memory) {
        return l.users[_addr];
    }

    function isUserRegistered(address _addr) public view returns (bool) {
        return l.users[_addr].isRegistered;
    }
}
