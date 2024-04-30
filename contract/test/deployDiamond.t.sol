// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../contracts/interfaces/IDiamondCut.sol";
import "../contracts/facets/DiamondCutFacet.sol";
import "../contracts/facets/DiamondLoupeFacet.sol";
import "../contracts/facets/OwnershipFacet.sol";
import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/Diamond.sol";
import "../contracts/facets/RealEstate.sol";
import "../contracts/libraries/LibAppStorage.sol";
import "../contracts/libraries/Errors.sol";
import "../contracts/facets/Trade.sol";
import "../contracts/CoitonNFT.sol";
import "../contracts/CoitonERC20.sol";
import "../contracts/Dao.sol";

contract DiamondDeployer is Test, IDiamondCut {
    // contract types of facets to be deployed
    LibAppStorage.Layout internal l;
    Diamond diamond;
    DiamondCutFacet dCutFacet;
    DiamondLoupeFacet dLoupe;
    OwnershipFacet ownerF;
    RealEstate realEstate;
    Trade trade;
    CoitonNFT coitonNFT;
    CoitonERC20 coitonERC20;
    Dao dao;

    address A = address(0xa);
    address B = address(0xb);
    address C = 0x107Ff7900F4dA6BFa4eB41dBD6f2953ffb41b2B1;
    address D = 0x107Ff7900F4dA6BFa4eB41dBD6f2953ffb41b2B1;

    address[] mockSigners = [address(0xC), address(0xD)]; // Mock signer addresses
    address[] emptySigners = new address[](0);

    RealEstate boundEstate;
    Trade boundTrade;

    function setUp() public {
        A = mkaddr("signer A");
        B = mkaddr("signer B");
        // C = mkaddr("signer C");
        //deploy facets
        dCutFacet = new DiamondCutFacet();
        diamond = new Diamond(address(this), address(dCutFacet), A);
        dLoupe = new DiamondLoupeFacet();
        ownerF = new OwnershipFacet();
        realEstate = new RealEstate();
        trade = new Trade();

        coitonNFT = new CoitonNFT();
        coitonERC20 = new CoitonERC20(A);
        dao = new Dao(address(boundEstate));

        // l.diamondAddress = address(diamond);

        //upgrade diamond with facets

        //build cut struct
        FacetCut[] memory cut = new FacetCut[](4);

        cut[0] = (
            FacetCut({
                facetAddress: address(dLoupe),
                action: FacetCutAction.Add,
                functionSelectors: generateSelectors("DiamondLoupeFacet")
            })
        );

        cut[1] = (
            FacetCut({
                facetAddress: address(ownerF),
                action: FacetCutAction.Add,
                functionSelectors: generateSelectors("OwnershipFacet")
            })
        );

        cut[2] = (
            FacetCut({
                facetAddress: address(realEstate),
                action: FacetCutAction.Add,
                functionSelectors: generateSelectors("RealEstate")
            })
        );

        cut[3] = (
            FacetCut({
                facetAddress: address(trade),
                action: FacetCutAction.Add,
                functionSelectors: generateSelectors("Trade")
            })
        );

        //upgrade diamond
        IDiamondCut(address(diamond)).diamondCut(cut, address(0x0), "");

        //call a function
        DiamondLoupeFacet(address(diamond)).facetAddresses();

        boundEstate = RealEstate(address(diamond));
        boundTrade = Trade(address(diamond));
        diamond.setToken(address(coitonERC20), address(coitonNFT));
    }

    function testCreateListing() public {
        switchSigner(A);
        vm.expectRevert(abi.encodeWithSelector(ERRORS.UNAUTHORIZED.selector));

        boundEstate.createListing(
            "1",
            address(0),
            // "nigeria",
            "lagos",
            "ikorodu",
            "Ikorodu street",
            0,
            "description",
            10,
            "",
            ""
        );
    }

    function testProposeBuy() public {
        switchSigner(A);
        boundEstate.proposeBuy(1, 1);
        LibAppStorage.Proposal memory new_listing = boundEstate.getProposal(0);
        assertEq(new_listing.estateId, 1);
    }

    function testProposePrice() public {
        switchSigner(B);
        boundEstate.proposeBuy(1, 2);
        LibAppStorage.Proposal memory new_listing = boundEstate.getProposal(0);
        assertEq(new_listing.price, 2);
    }

    function testEmptySignerPurchase() public {
        switchSigner(A);
        vm.expectRevert(abi.encodeWithSelector(ERRORS.INVALID_SIGNERS_COUNT.selector));
        boundEstate.initiatePurchaseAgreement(1, A, emptySigners);
    }

    function testIsSignerValid() public {
        switchSigner(B);
        vm.expectRevert(abi.encodeWithSelector(ERRORS.INVALID_ENTITIES.selector));
        boundEstate.initiatePurchaseAgreement(1, A, mockSigners);
    }

    function testIsValidSigner() public {
        switchSigner(B);
        boundEstate.initiatePurchaseAgreement(1, B, mockSigners);
        bool isValid = boundEstate.isValidSigner(1, address(0xC));

        assertEq(isValid, true);
    }

    function testInitiateSignerStateChange() public {
        switchSigner(B);
        boundEstate.initiatePurchaseAgreement(1, B, mockSigners);
        LibAppStorage.PurchaseAgreement memory new_listing = boundEstate.getPurchaseAgreement(1);
        assertEq(new_listing.id, 1);
        assertEq(new_listing.buyer, B);
        assertEq(new_listing.estateId, 1);
        assertEq(new_listing.initiator, B);
    }

    function testSignPurchaseAgreementvalid() public {
        switchSigner(B);
        boundEstate.initiatePurchaseAgreement(1, B, mockSigners);
        vm.expectRevert(abi.encodeWithSelector(ERRORS.NOT_A_VALID_SIGNER.selector));
        boundEstate.signPurchaseAgreement(2);
    }

    function testSignPurchaseAgreementFunction() public {
        switchSigner(B);
        boundEstate.initiatePurchaseAgreement(1, B, mockSigners);
        switchSigner(address(0xC));

        boundEstate.signPurchaseAgreement(1);
    }

    function testSignPurchaseAgreementAlreadySigned() public {
        switchSigner(B);
        boundEstate.initiatePurchaseAgreement(1, B, mockSigners);
        switchSigner(address(0xC));
        boundEstate.signPurchaseAgreement(1);
        vm.expectRevert(abi.encodeWithSelector(ERRORS.ALREADY_SIGNED.selector));

        boundEstate.signPurchaseAgreement(1);
    }

    function testSignPurchaseAgreementStateChangeTrue() public {
        switchSigner(A);
        coitonERC20.mintTo(B, 5 * 10 ** 18);
        string memory hash_id = "UUIDV4";
        bytes32 hash = keccak256(
            abi.encodePacked(B, country, state, city, estateAddress, postalCode, description, price, images, "cover")
        );
        // boundEstate.approveListing(hash_id, hash, B);

        switchSigner(B);

        boundEstate.createListing(
            hash_id,
            B,
            // country,
            state,
            city,
            estateAddress,
            postalCode,
            description,
            price,
            images,
            "cover"
        );

        coitonERC20.approve(address(boundEstate), price);
        coitonNFT.approve(address(boundEstate), 1);
        boundEstate.initiatePurchaseAgreement(1, B, mockSigners);
        switchSigner(address(0xC));
        boundEstate.signPurchaseAgreement(1);

        switchSigner(address(0xD));
        boundEstate.signPurchaseAgreement(1);

        LibAppStorage.PurchaseAgreement memory new_listing = boundEstate.getPurchaseAgreement(1);
        assertEq(new_listing.executed, true);
    }

    function testlengthOfSigners() public {
        switchSigner(B);
        boundEstate.initiatePurchaseAgreement(1, B, mockSigners);
        switchSigner(address(0xC));
        boundEstate.signPurchaseAgreement(1);
        LibAppStorage.PurchaseAgreement memory new_listing = boundEstate.getPurchaseAgreement(1);
        assertEq(new_listing.executed, false);
    }

    /// Testing the Trade.sol
    function testEXHAUSTED_TOKEN_SHARE() public {
        uint256 tokenId = 100;
        uint8 sharesToExceed = 101;
        vm.expectRevert(abi.encodeWithSelector(ERRORS.EXHAUSTED_TOKEN_SHARES.selector));
        boundTrade.buyNFTTokenShares(tokenId, sharesToExceed);
    }

    // function testINSUFFICIENT_BALANCE() public {
    //     switchSigner(A);
    //     uint id = 10;
    //     uint8 shares = 2;
    //        uint bal =  l.stake[A];
    //      LibAppStorage.Market storage tokenMarket = l.market[id];
    //    uint tokenValue = boundTrade.calculateTokenValueInShares(shares, tokenMarket.currentPrice);
    //     // vm.expectRevert(
    //     //     abi.encodeWithSelector(ERRORS.INSUFFICIENT_BALANCE.selector)
    //     // );

    //     boundTrade.buyNFTTokenShares(id, shares);
    //     assertGt(tokenValue, bal);
    // }

    function testbuyNFTTokenShares() public {
        switchSigner(A);
        boundTrade.buyNFTTokenShares(1, 1);
    }

    function testINSUFFICIENT_SHARES() public {
        switchSigner(A);
        vm.expectRevert(abi.encodeWithSelector(ERRORS.INSUFFICIENT_SHARES.selector));

        boundTrade.sellNFTTokenShares(1, 1);
    }

    function testsellNFTTokenShares() public {
        switchSigner(A);
        boundTrade.buyNFTTokenShares(2, 10);
        uint8 userShare = 2;
        boundTrade.sellNFTTokenShares(2, userShare);
    }

    // function testCreatedListNOTAPPROVED() public {
    //     switchSigner(A);
    //     vm.expectRevert(
    //         abi.encodeWithSelector(ERRORS.LISTING_NOT_APPROVED.selector)
    //     );
    //     boundEstate.createListing(
    //         "1",
    //         A,
    //         // "nigeria",
    //         "lagos",
    //         "ikorodu",
    //         "estateAddress",
    //         0,
    //         "description",
    //         10,
    //         "",
    //         ""
    //     );
    // }

    string id = "1";
    address owner = A;
    string country = "Nigeria";
    string state = "Lagos";
    string city = "Ikorodu";
    string estateAddress = "A";
    uint24 postalCode = 10;
    string description = "createlist";
    uint256 price = 1;
    string images = "";

    // function testCreatedListStateINVALIDLISTING() public {
    //     switchSigner(A);

    //     bytes32 hash1 = keccak256(
    //         abi.encodePacked(
    //             "1",
    //             A,
    //             country,
    //             state,
    //             city,
    //             estateAddress,
    //             postalCode,
    //             description,
    //             price,
    //             images
    //         )
    //     );

    //     // boundEstate.approveListing("1", hash1, A);
    //     // vm.expectRevert(
    //     //     abi.encodeWithSelector(ERRORS.INVALID_LISTING_HASH.selector)
    //     // );
    //     boundEstate.createListing(
    //         "1",
    //         A,
    //         // country,
    //         state,
    //         city,
    //         estateAddress,
    //         postalCode,
    //         description,
    //         price,
    //         images,
    //         ""
    //     );
    // }

    // function testCreatedListStateI() public {
    //     switchSigner(A);
    //     string memory hash_id = "UUIDV4";
    //     bytes32 hash = keccak256(
    //         abi.encodePacked(
    //             B,
    //             country,
    //             state,
    //             city,
    //             estateAddress,
    //             postalCode,
    //             description,
    //             price,
    //             images,
    //             "cover"
    //         )
    //     );

    //     boundEstate.createListing(
    //         hash_id,
    //         B,
    //         // country,
    //         state,
    //         city,
    //         estateAddress,
    //         postalCode,
    //         description,
    //         price,
    //         images,
    //         "cover"
    //     );

    //      LibAppStorage.Listing memory new_listing = boundEstate.getListing(1);
    //      assertEq(new_listing.owner, B);
    // }

    // function testApproveListing() public {
    //     switchSigner(A);

    //     bytes32 hash1 = keccak256(
    //         abi.encodePacked(
    //             "1",
    //             A,
    //             country,
    //             state,
    //             city,
    //             estateAddress,
    //             postalCode,
    //             description,
    //             price,
    //             images
    //         )
    //     );

    //     // boundEstate.approveListing("1", hash1, A);
    //     vm.expectRevert(
    //         abi.encodeWithSelector(ERRORS.LISTING_ALREADY_APPROVED.selector)
    //     );
    //     // boundEstate.approveListing("1", hash1, A);
    // }

    // function testApproveListingStateChange() public {
    //     switchSigner(A);

    //     bytes32 hash1 = keccak256(
    //         abi.encodePacked(
    //             "1",
    //             A,
    //             country,
    //             state,
    //             city,
    //             estateAddress,
    //             postalCode,
    //             description,
    //             price,
    //             images
    //         )
    //     );

    //     // boundEstate.approveListing("1", hash1, A);
    //     boundEstate.queListingForApproval("1", hash1, A);
    //     LibAppStorage.ListingApproval memory new_list = boundEstate.getHash(
    //         "1"
    //     );

    //    // assertEq(new_list.approved, false);
    //      assertEq(new_list.approver, A);
    // }

    function testDaoclaimStateSuperior() public {
        switchSigner(B);
        string memory hash_id = "UUIDV4";
        vm.expectRevert("UNAUTHORIZED");
        dao.claimStateSuperior(hash_id);
    }

    address nextSuperior = address(0xC);
    address superior = address(0xB);

    function testtransferSuperior() public {
        switchSigner(B);
        string memory hash_id = "UUIDV4";
        vm.expectRevert("UNAUTHORIZED");
        dao.transferSuperior(A);
    }

    function testclaimSuperior() public {
        switchSigner(B);
        string memory hash_id = "UUIDV4";
        vm.expectRevert("UNAUTHORIZED");
        dao.claimSuperior();
    }

    function testDaoTransferStateuperior() public {
        //address nextSuperior = B;
        switchSigner(address(superior));
    }

    struct Agent {
        address id;
        string name;
        string code;
        string region;
        string bio;
        bool deleted;
    }
    /// @dev This struct holds all the crucial information for the administration,
    /// @dev including the address of the multi-approver process and the agents involved in the administration.

    struct Administration {
        address superior;
        address nextSuperior;
        string state;
        string region;
    }
    // Agent[] agents;

    function testAdministration() public {
        Administration memory expected = Administration(A, B, "1", "1");
        Administration memory actual = _Administration(0);
        assertEq(expected, actual);
    }

    // implement a function that accepts 2 TokenMetadata variables to compare
    function assertEq(Administration memory expected, Administration memory actual) internal {
        bytes memory expectedBytes = abi.encode(expected);
        bytes memory actualBytes = abi.encode(actual);
        assertEq(expectedBytes, actualBytes);
    }

    function _Administration(uint256 tokenId) internal view returns (Administration memory administration) {
        if (tokenId == 0) {
            administration.superior = A;
            administration.nextSuperior = B;
            administration.state = "1";
            administration.region = "1";
        }
    }

    function testcreateAdministrationState() public {
        Dao.Administration memory administration = dao.getAdministration("1");

        A = address(administration.superior);
        switchSigner(A);
        dao.createAdministration(0x107Ff7900F4dA6BFa4eB41dBD6f2953ffb41b2B1, "1", "1");

        assertEq(administration.superior, A, "Superior address should be set to A");
    }

        function testcreateAdministrationINVALID_ADDRESS() public {
        Dao.Administration memory administration = dao.getAdministration("1");

        A = address(administration.superior);
        switchSigner(A);
         vm.expectRevert("INVALID_ADDRESS");
        dao.createAdministration(address(0), "1", "1");
    }

        function testcreateAdministrationStateAsserts() public {
        Dao.Administration memory administration = dao.getAdministration("1");

        A = address(administration.superior);
        switchSigner(A);
        dao.createAdministration(0x107Ff7900F4dA6BFa4eB41dBD6f2953ffb41b2B1, "1", "1");
         Dao.Administration memory _administration = dao.getAdministration("1");

        assertEq(_administration.state, "1");
        assertEq(_administration.region, "1");
    }

       function testcreateAdministratiSTATFIELD() public {
        Dao.Administration memory administration = dao.getAdministration("1");

        A = address(administration.superior);
        switchSigner(A);
         vm.expectRevert("INVALID_STATE_FIELD");
        dao.createAdministration(0x107Ff7900F4dA6BFa4eB41dBD6f2953ffb41b2B1, "", "1");

    }

           function testcreateAdministratiREGIONFIELD() public {
        Dao.Administration memory administration = dao.getAdministration("1");

        A = address(administration.superior);
        switchSigner(A);
         vm.expectRevert("INVALID_REGION_FIELD");
        dao.createAdministration(0x107Ff7900F4dA6BFa4eB41dBD6f2953ffb41b2B1, "1", "");

    }

            Dao.Listing listing = Dao.Listing({
    owner: A, 
    agentId: B, 
    country: "Country",
    state: "State",
    city: "City",
    estateAddress: "Estate Address",
    postalCode: 12345,
    description: "Description",
    price: 100,
    images: "Images",
    features: "Features",
    coverImage: "Cover Image",
    id: "Listing ID"
});
    function testdelegatecallorigin() public {

                bytes32 hash = keccak256(
            abi.encodePacked(
                B,
                country,
                state,
                city,
                estateAddress,
                postalCode,
                description,
                price,
                images,
                "cover"
            )
        );
        address ownerAddress = dao.owner();


        A = ownerAddress;
        switchSigner(A);
          vm.expectRevert("STATE_NOT_REGISTERED");
        dao.delegateListingForApproval("1", hash, listing);
    }
    


    function AddAgent() public {
        switchSigner(A);

    Dao.Agent memory agent = Dao.Agent({
    id: A, 
    name: "AgentName",
    code: "AgentCode",
    region: "AgentRegion",
    bio: "AgentBio",
    deleted: true 
});

    dao.addAgent("1", agent);
         Dao.Administration memory administration = dao.getAdministration("1");
            Dao.Agent memory addedAgent = administration.agents[0];
        // //     A = address(administration.superior);
        assertEq(addedAgent.id, B);
        assertEq(addedAgent.deleted, true);

    }

    function generateSelectors(string memory _facetName) internal returns (bytes4[] memory selectors) {
        string[] memory cmd = new string[](3);
        cmd[0] = "node";
        cmd[1] = "scripts/genSelectors.js";
        cmd[2] = _facetName;
        bytes memory res = vm.ffi(cmd);
        selectors = abi.decode(res, (bytes4[]));
    }

    function mkaddr(string memory name) public returns (address) {
        address addr = address(uint160(uint256(keccak256(abi.encodePacked(name)))));
        vm.label(addr, name);
        return addr;
    }

    function switchSigner(address _newSigner) public {
        address foundrySigner = 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38;
        if (msg.sender == foundrySigner) {
            vm.startPrank(_newSigner);
        } else {
            vm.stopPrank();
            vm.startPrank(_newSigner);
        }
    }

    function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external override {}
}
