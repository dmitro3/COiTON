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

    function getErc20Token() external view returns (address) {
        return l.erc20Token;
    }

    // The queueListingForApproval function is designed to handle the initiation of a listing approval
    /// @param id : Unique identifier for the listing
    /// @param hash : Hash of the listing details for integrity verification
    /// @param approver : Address of the entity authorized to approve the listing
    // This function accepts the following parameters from the backend:
    // a hash and an ID associated with the listing that needs approval.
    function queListingForApproval(string memory id, bytes32 hash, address approver) external {
        if (tx.origin != l.owner) {
            revert ERRORS.UNAUTHORIZED();
        }

        LibAppStorage.ListingApproval storage _newListingApproval = l.listingApproval[id];

        if (_newListingApproval.approved) {
            revert ERRORS.LISTING_ALREADY_APPROVED();
        }
        _newListingApproval.approved = false;
        _newListingApproval.hash = hash;
        _newListingApproval.approver = approver;

        emit EVENTS.ListingQueuedForApproval(id, hash, approver);
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
        address agent,
        string memory region,
        uint24 postalCode,
        string memory description,
        uint256 price,
        string memory images,
        string memory coverImage
    ) external {
        LibAppStorage.ListingApproval storage _listingApproval = l.listingApproval[id];

        if (tx.origin != _listingApproval.approver) {
            revert ERRORS.UNAUTHORIZED();
        }

        if (_listingApproval.created) {
            revert ERRORS.LISTING_ALREADY_CREATED();
        }

        bytes32 hash = keccak256(abi.encodePacked(id, agent, region, postalCode, description, price, images));

        if (_listingApproval.hash != hash) {
            revert ERRORS.INVALID_LISTING_HASH();
        }
        uint256 listingId = l.listings.length + 1;
        ICoitonNFT(l.erc721Token).mint(agent, listingId, coverImage);
        LibAppStorage.Listing memory _newListing = LibAppStorage.Listing(
            id, agent, region, postalCode, description, price, images, listingId, coverImage, block.timestamp
        );
        _listingApproval.approved = true;
        _listingApproval.created = true;
        l.listing[listingId] = _newListing;

        l.listings.push(_newListing);

        emit EVENTS.CreatedListing(agent, listingId, price);
    }

    // This function allows external caller to submit a proposal to purchase a real estate property
    //@param estateId : Identifying the estate that the user went to propose to buy
    //@param price: User estimated price.
    function proposeBuy(uint256 estateId, uint256 price) external {
        LibAppStorage.Proposal memory _newProposal =
            LibAppStorage.Proposal({from: msg.sender, price: price, estateId: estateId});

        l.proposals.push(_newProposal);

        emit EVENTS.NewProposal(msg.sender, estateId, price);
    }

    //This function is designed to retrieve all the listings that have been created.
    //@param Id: The Id use to fetch all the listing created
    //@notice returns all the listing created from the array
    function getListing(uint256 Id) external view returns (LibAppStorage.Listing memory) {
        return l.listings[Id];
    }

    function getListings() external view returns (LibAppStorage.Listing[] memory) {
        return l.listings;
    }

    //This function is designed to retrieve all the proposals to buy that have been submitted
    //@param Id: The Id is use to fetch all the Proposals submitted.
    //@notice returns all the proposals from the array
    function getProposal(uint256 Id) external view returns (LibAppStorage.Proposal memory) {
        return l.proposals[Id];
    }

    /// This function is to get all the real estate listing hash.
    /// @param Id : The Id is use to fetch all the Listing real estate hash.
    //@notice returns all the hash from the array.
    function getHash(string memory Id) external view returns (LibAppStorage.ListingApproval memory) {
        return l.listingApproval[Id];
    }

    /// This functions takes in the important information for the listing estate and hash it
    /// @param owner : the owner's address in the hash helps bind the hash specifically to the owner,
    //                ensuring that the same data owned by different addresses results in different hashes.
    /// @param country : The country where the property is located.
    /// @param state :The state or region within the country where the property is located
    /// @param city  : The city where the property is located
    /// @param estateAddress : The specific street address of the property.
    /// @param postalCode  : The postal code of the property's location.
    /// @param description : description of the property
    /// @param price : The listing price of the property
    /// @param images : Image of the listed house
    /// @param coverImage : The image that will act as an NFT in the trading platform
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
        return keccak256(
            abi.encodePacked(
                owner, country, state, city, estateAddress, postalCode, description, price, images, coverImage
            )
        );
    }

    function isValidSigner(uint256 agreementId, address signer) external view returns (bool) {
        return l.isValidSigner[agreementId][signer];
    }

    //This function is used to start a purchase agreement process for a specific real estate property on the platform
    //@Param estateId: The identifier for the estate being purchased.
    //@Param buyer: The address of a potenial buyer of the real estate.
    //Param singners: An addresses authorized to sign the agreement
    //We tend to implement and check if it is the owner is initiating the transaction and if the buyer is among
    //the lists of signers.
    //Then the storage is updated .
    function initiatePurchaseAgreement(uint256 estateId, address buyer, address[] memory signers) external {
        if (signers.length == 0) {
            revert ERRORS.INVALID_SIGNERS_COUNT();
        }

        bool is_party_valid = false;
        if (msg.sender == buyer) {
            is_party_valid = true;
        } else {
            if (l.listing[estateId].owner == msg.sender) {
                for (uint256 i = 0; i < signers.length; i++) {
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

        for (uint256 i = 0; i < signers.length; i++) {
            l.isValidSigner[estateId][signers[i]] = true;
        }

        l.purchaseAgreementCount++;
        LibAppStorage.PurchaseAgreement storage _newPurchaseAgreement = l.purchaseAgreement[l.purchaseAgreementCount];
        _newPurchaseAgreement.id = l.purchaseAgreementCount;
        _newPurchaseAgreement.initiator = msg.sender;
        _newPurchaseAgreement.estateId = estateId;
        _newPurchaseAgreement.validSigners = signers;
        _newPurchaseAgreement.buyer = buyer;

        emit EVENTS.PurchaseAgreementInitialization(estateId, msg.sender, signers);
    }

    function getPurchaseAgreementSigners(address _user)
        external
        view
        returns (LibAppStorage.PurchaseAgreement[] memory, bool[] memory)
    {
        uint256 count;

        for (uint256 i = 1; i < l.purchaseAgreementCount + 1; i++) {
            LibAppStorage.PurchaseAgreement memory _purchaseAgreement = l.purchaseAgreement[i];

            for (uint256 j = 0; j < _purchaseAgreement.validSigners.length; j++) {
                if (_purchaseAgreement.validSigners[j] == _user) {
                    count += 1;
                }
            }
        }

        LibAppStorage.PurchaseAgreement[] memory _returnAgreement = new LibAppStorage.PurchaseAgreement[](count);
        bool[] memory _returnHasSigned = new bool[](count);

        uint256 index;

        for (uint256 i = 1; i < l.purchaseAgreementCount + 1; i++) {
            LibAppStorage.PurchaseAgreement memory _purchaseAgreement = l.purchaseAgreement[i];

            for (uint256 j = 0; j < _purchaseAgreement.validSigners.length; j++) {
                if (_purchaseAgreement.validSigners[j] == _user) {
                    _returnAgreement[index] = _purchaseAgreement;
                    _returnHasSigned[index] = l.hasSignedPurchaseAgreement[_purchaseAgreement.estateId][msg.sender];

                    index++;
                }
            }
        }

        return (_returnAgreement, _returnHasSigned);
    }

    function getEstateSigner(address _user, uint256 estateId)
        external
        view
        returns (LibAppStorage.PurchaseAgreement memory returnPurchaseAgreement_, bool hasSigned_)
    {
        for (uint256 i = 1; i < l.purchaseAgreementCount + 1; i++) {
            LibAppStorage.PurchaseAgreement memory _purchaseAgreement = l.purchaseAgreement[i];

            if (_purchaseAgreement.estateId == estateId) {
                for (uint256 j = 0; j < _purchaseAgreement.validSigners.length; j++) {
                    if (_purchaseAgreement.validSigners[j] == _user) {
                        returnPurchaseAgreement_ = _purchaseAgreement;
                        hasSigned_ = l.hasSignedPurchaseAgreement[_purchaseAgreement.estateId][_user];
                    }
                }
            }
        }
    }

    function getUserInitiatedPurchaseArgument(address _user, uint256 estateId)
        external
        view
        returns (LibAppStorage.PurchaseAgreement memory _return)
    {
        for (uint256 i = 1; i < l.purchaseAgreementCount + 1; i++) {
            LibAppStorage.PurchaseAgreement memory _purchaseAgreement = l.purchaseAgreement[i];

            if (_purchaseAgreement.initiator == _user && _purchaseAgreement.estateId == estateId) {
                _return = _purchaseAgreement;
            }
        }
    }

    /// The function  is to get all the agreement purchase
    /// @param agreementId : Use to fetch all the agreement purchase from the array.
    function getPurchaseAgreement(uint256 agreementId) external view returns (LibAppStorage.PurchaseAgreement memory) {
        return l.purchaseAgreement[agreementId];
    }

    function checkIfApprovedERC20Token(uint256 estateId, address _user) external view returns (bool) {
        LibAppStorage.Listing memory listing = l.listing[estateId];
        IIERC20 erc20Token = IIERC20(l.erc20Token);

        return erc20Token.allowance(_user, address(this)) >= listing.price;
    }

    function checkIfApprovedERC721Token(uint256 estateId) external view returns (bool) {
        LibAppStorage.Listing memory listing = l.listing[estateId];
        IERC721 erc721Token = IERC721(l.erc721Token);
        return erc721Token.getApproved(listing.tokenId) == address(this);
    }

    // This function is designed to allow an authorized party to sign a purchase agreement for a specified real estate property on the platform.
    //@Param estateId: Identify the specific purchase agreement related to a real estate property.
    //After all the aggrement has been settled the transfer of our token is sent buyer
    function signPurchaseAgreement(uint256 estateId) external {
        if (!l.isValidSigner[estateId][msg.sender]) {
            revert ERRORS.NOT_A_VALID_SIGNER();
        }
        if (l.hasSignedPurchaseAgreement[estateId][msg.sender]) {
            revert ERRORS.ALREADY_SIGNED();
        }
        LibAppStorage.PurchaseAgreement storage _purchaseAgreement = l.purchaseAgreement[estateId];
        if (_purchaseAgreement.executed) {
            revert ERRORS.ALREADY_EXECUTED();
        }

        _purchaseAgreement.signersCount += 1;
        l.hasSignedPurchaseAgreement[estateId][msg.sender] = true;

        if (_purchaseAgreement.signersCount == _purchaseAgreement.validSigners.length) {
            _purchaseAgreement.executed = true;

            LibAppStorage.Listing storage listing = l.listing[estateId];

            IIERC20 erc20Token = IIERC20(l.erc20Token);
            IERC721 erc721Token = IERC721(l.erc721Token);
            if (erc20Token.allowance(_purchaseAgreement.buyer, address(this)) < listing.price) {
                revert ERRORS.NO_APPROVAL_TO_SPEND_TOKENS();
            } else {
                erc20Token.transferFrom(_purchaseAgreement.buyer, address(this), listing.price);
            }

            if (erc721Token.getApproved(listing.tokenId) != address(this)) {
                revert ERRORS.NO_APPROVAL_TO_SPEND_TOKENS();
            }

            erc20Token.transfer(listing.owner, listing.price);
            erc721Token.safeTransferFrom(listing.owner, _purchaseAgreement.buyer, listing.tokenId);

            LibAppStorage.Listing storage _listing = l.listings[listing.tokenId - 1];
            _listing.owner = _purchaseAgreement.buyer;

            listing.owner = _purchaseAgreement.buyer;

            assert(erc721Token.ownerOf(listing.tokenId) == _purchaseAgreement.buyer);
        }
    }
}
