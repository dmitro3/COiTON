// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "../libraries/LibAppStorage.sol";
import "../libraries/Events.sol";
import "../libraries/Errors.sol";

contract RealEstate {
    LibAppStorage.Layout internal l;
    modifier OnlyOwner() {
        if (msg.sender != l.owner) {
            revert ERRORS.UNAUTHORIZED();
        }
        _;
    }

    // constructor(address erc20Token, address erc1155Token) {
    //     l.erc20Token = erc20Token;
    //     l.erc1155Token = erc1155Token;
    //     l.owner = msg.sender;
    // }

    function updateERC20Token(address _address) external OnlyOwner {
        l.erc20Token = _address;
    }

    function updateERC1155Token(address _address) external OnlyOwner {
        l.erc1155Token = _address;
    }

    function createListing(
        address owner,
        string memory country,
        string memory state,
        string memory city,
        string memory estateAddress,
        uint24 postalCode,
        string memory description,
        uint256 price,
        string memory images
    ) external {
        // require(msg.sender != address(0), "INVALID_CONTRACT_ADDRESS");
          if (owner == address(0)) {
            revert ERRORS.UNAUTHORIZED();
        }
        LibAppStorage.Listing memory _newListing = LibAppStorage.Listing(
            l.listings.length + 1,
            owner,
            country,
            state,
            city,
            estateAddress,
            postalCode,
            description,
            price,
            images,
            1,
            block.timestamp
        );

        /// mint erc1155 token here

        l.listings.push(_newListing);

        emit EVENTS.CreatedListing(owner, 1, price);
    }

    function proposeBuy(uint estateId, uint price) external {
        LibAppStorage.Proposal memory _newProposal = LibAppStorage.Proposal({
            from: msg.sender,
            price: price,
            estateId: estateId
        });

        l.proposals.push(_newProposal);

        emit EVENTS.NewProposal(msg.sender, estateId, price);
    }
       function getListing(
        uint Id
    ) external view returns (LibAppStorage.Listing memory) {
        return l.listings[Id];
    }
           function getProposal(
        uint Id
    ) external view returns (LibAppStorage.Proposal memory) {
        return l.proposals[Id];
    }

    function initiatePurchaseAgreement(
        uint estateId,
        address buyer,
        address[] memory signers
    ) external {
        if (signers.length == 0) {
            revert ERRORS.INVALID_SIGNERS_COUNT();
        }

        bool is_party_valid = false;
        if (msg.sender == buyer) {
            is_party_valid = true;
        } else {
            if (l.listing[estateId].owner == msg.sender) {
                for (uint i = 0; i < signers.length; i++) {
                    if (signers[i] == buyer) {
                        is_party_valid = true;
                        break;
                    }
                }
            }
        }

        if (!is_party_valid) {
            revert ERRORS.INVALID_ENTITIES();
        }

        for (uint i = 0; i < signers.length; i++) {
            l.isValidSigner[estateId][signers[i]] = true;
        }

        l.purchaseAgreementCount++;
        LibAppStorage.PurchaseAgreement storage _newPurchaseAgreement = l
            .purchaseAgreement[l.purchaseAgreementCount];
        _newPurchaseAgreement.id = l.purchaseAgreementCount;
        _newPurchaseAgreement.initiator = msg.sender;
        _newPurchaseAgreement.estateId = estateId;
        _newPurchaseAgreement.validSigners = signers;
        _newPurchaseAgreement.buyer = buyer;

        emit EVENTS.PurchaseAgreementInitialization(
            estateId,
            msg.sender,
            signers
        );
    }

    function signPurchaseAgreement(uint estateId) external {
        if (!l.isValidSigner[estateId][msg.sender]) {
            revert ERRORS.NOT_A_VALID_SIGNER();
        }
        if (l.hasSignedPurchaseAgreement[estateId][msg.sender]) {
            revert ERRORS.ALREADY_SIGNED();
        }
        LibAppStorage.PurchaseAgreement storage _purchaseAgreement = l
            .purchaseAgreement[estateId];
        if (_purchaseAgreement.executed) {
            revert ERRORS.ALREADY_EXECUTED();
        }

        _purchaseAgreement.signersCount += 1;

        if (
            _purchaseAgreement.signersCount ==
            _purchaseAgreement.validSigners.length
        ) {
            _purchaseAgreement.executed = true;
            /// TRANSFER TOKENS HERE;
        }
    }
}
