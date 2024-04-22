// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "../libraries/LibAppStorage.sol";
import "../libraries/Events.sol";
import "../libraries/Errors.sol";
import "../interfaces/ICoitonNFT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../interfaces/IERC20.sol";

contract RealEstate {
    //Instantiating a new Layout from the LibAppStorage.
    LibAppStorage.Layout internal l;

    //The modifier restrict the execution of certain function to the owner .
    // This condition checks if the address calling the function
    //is not the same as the owner's address stored in the state variable l.owner.
    //revert
    modifier OnlyOwner() {
        if (msg.sender != l.owner) {
            revert ERRORS.UNAUTHORIZED();
        }
        _;
    }

    //The function enables the updating of the ERC20 token's address.
    function updateERC20Token(address _address) external OnlyOwner {
        l.erc20Token = _address;
    }

    //The function enables the updating of the ERC1155 token's address.
    function updateERC721Token(address _address) external OnlyOwner {
        l.erc721Token = _address;
    }

    function approveListing(
        string memory id,
        bytes32 hash,
        address owner
    ) external OnlyOwner {
        LibAppStorage.ListingApproval storage _newListingApproval = l
            .listingApproval[id];

        if (_newListingApproval.approved) {
            revert ERRORS.LISTING_ALREADY_APPROVED();
        }
        _newListingApproval.approved = true;
        _newListingApproval.hash = hash;
        _newListingApproval.owner = owner;
    }

    // This function is use to create new listings
    //@param address owner the owner address in this case the agent or house owner address
    //@param country : The country where the real estate is located
    //@param State: The state where the real estate is located
    //@param City: The City where the real estate is located
    //@param estateAddress: The estate address where it is located in the city
    //@param postalCode: The indicate the specific geographical area of the estate
    // The function will store the listing data gotten from the external server.
    // After storing the listing data an NFT will be minted to the agent or the house owner.
    function createListing(
        string memory id,
        address owner,
        string memory country,
        string memory state,
        string memory city,
        string memory estateAddress,
        uint24 postalCode,
        string memory description,
        uint256 price,
        string memory images,
        string memory coverImage
    ) external {
        if (owner == address(0)) {
            revert ERRORS.UNAUTHORIZED();
        }

        LibAppStorage.ListingApproval storage _listingApproval = l
            .listingApproval[id];

        if (!_listingApproval.approved) {
            revert ERRORS.LISTING_NOT_APPROVED();
        }

        if (msg.sender != _listingApproval.owner) {
            revert ERRORS.UNAUTHORIZED();
        }

        if (_listingApproval.created) {
            revert ERRORS.LISTING_ALREADY_CREATED();
        }

        bytes32 hash = keccak256(
            abi.encodePacked(
                owner,
                country,
                state,
                city,
                estateAddress,
                postalCode,
                description,
                price,
                images,
                coverImage
            )
        );

        if (_listingApproval.hash != hash) {
            revert ERRORS.INVALID_LISTING_HASH();
        }
        uint listingId = l.listings.length + 1;
        ICoitonNFT(l.erc721Token).mint(msg.sender, listingId, coverImage);
        LibAppStorage.Listing memory _newListing = LibAppStorage.Listing(
            listingId,
            owner,
            country,
            state,
            city,
            estateAddress,
            postalCode,
            description,
            price,
            images,
            listingId,
            coverImage,
            block.timestamp
        );

        _listingApproval.created = true;
        l.listing[listingId] = _newListing;

        l.listings.push(_newListing);

        emit EVENTS.CreatedListing(owner, listingId, price);
    }

    // This function allows external caller to submit a proposal to purchase a real estate property
    //@param estateId : Identifying the estate that the user went to propose to buy
    //@param price: User estimated price.
    function proposeBuy(uint estateId, uint price) external {
        LibAppStorage.Proposal memory _newProposal = LibAppStorage.Proposal({
            from: msg.sender,
            price: price,
            estateId: estateId
        });

        l.proposals.push(_newProposal);

        emit EVENTS.NewProposal(msg.sender, estateId, price);
    }

    //This function is designed to retrieve all the listings that have been created.
    //@param Id: The Id use to fetch all the listing created
    //@notice returns all the listing created from the array
    function getListing(
        uint Id
    ) external view returns (LibAppStorage.Listing memory) {
        return l.listings[Id];
    }

    //This function is designed to retrieve all the proposals to buy that have been submitted
    //@param Id: The Id use to fetch all the Proposals submitted.
    //@notice returns all the proposals from the array
    function getProposal(
        uint Id
    ) external view returns (LibAppStorage.Proposal memory) {
        return l.proposals[Id];
    }

    function getHash(string memory Id) external view returns (bytes32) {
        return l.listingApproval[Id].hash;
    }

    function computeHash(
        address owner,
        string memory country,
        string memory state,
        string memory city,
        string memory estateAddress,
        uint24 postalCode,
        string memory description,
        uint256 price,
        string memory images,
        string memory coverImage
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    owner,
                    country,
                    state,
                    city,
                    estateAddress,
                    postalCode,
                    description,
                    price,
                    images,
                    coverImage
                )
            );
    }

    function isValidSigner(
        uint agreementId,
        address signer
    ) external view returns (bool) {
        return l.isValidSigner[agreementId][signer];
    }

    //This function is used to start a purchase agreement process for a specific real estate property on the platform
    //@Param estateId: The identifier for the estate being purchased.
    //@Param buyer: The address of a potenial buyer of the real estate.
    //Param singners: An addresses authorized to sign the agreement
    //We tend to implement and check if it is the owner is initiating the transaction and if the buyer is among
    //the lists of signers.
    //Then the storage is updated .
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

    function getPurchaseAgreement(
        uint agreementId
    ) external view returns (LibAppStorage.PurchaseAgreement memory) {
        return l.purchaseAgreement[agreementId];
    }

    // This function is designed to allow an authorized party to sign a purchase agreement for a specified real estate property on the platform.
    //@Param estateId: Identify the specific purchase agreement related to a real estate property.
    //After all the aggrement has been settled the transfer of our token is sent buyer
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
        l.hasSignedPurchaseAgreement[estateId][msg.sender] = true;

        if (
            _purchaseAgreement.signersCount ==
            _purchaseAgreement.validSigners.length
        ) {
            _purchaseAgreement.executed = true;

            LibAppStorage.Listing memory listing = l.listing[estateId];
            IIERC20 erc20Token = IIERC20(l.erc20Token);
            IERC721 erc721Token = IERC721(l.erc721Token);
            if (
                erc20Token.allowance(_purchaseAgreement.buyer, address(this)) <
                listing.price
            ) {
                revert ERRORS.NO_APPROVAL_TO_SPEND_TOKENS();
            } else {
                erc20Token.transferFrom(
                    _purchaseAgreement.buyer,
                    address(this),
                    listing.price
                );
            }

            if (erc721Token.getApproved(listing.tokenId) != address(this)) {
                revert ERRORS.NO_APPROVAL_TO_SPEND_TOKENS();
            }

            erc20Token.transfer(listing.owner, listing.price);
            erc721Token.safeTransferFrom(
                listing.owner,
                _purchaseAgreement.buyer,
                listing.tokenId
            );

            assert(
                erc721Token.ownerOf(listing.tokenId) == _purchaseAgreement.buyer
            );
        }
    }
}
