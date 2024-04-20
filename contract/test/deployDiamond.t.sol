// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../contracts/interfaces/IDiamondCut.sol";
import "../contracts/facets/DiamondCutFacet.sol";
import "../contracts/facets/DiamondLoupeFacet.sol";
import "../contracts/facets/OwnershipFacet.sol";
import "forge-std/Test.sol";
import "../contracts/Diamond.sol";
import "../contracts/facets/RealEstate.sol";
import "../contracts/libraries/LibAppStorage.sol";
import "../contracts/libraries/Errors.sol";
import "../contracts/facets/Trade.sol";

 contract DiamondDeployer is Test, IDiamondCut {

   // contract types of facets to be deployed
    Diamond diamond;
    DiamondCutFacet dCutFacet;
    DiamondLoupeFacet dLoupe;
    OwnershipFacet ownerF;
    RealEstate realEstate;
    Trade trade;

        address A = address(0xa);
        address B = address(0xb);
        address C = 0x107Ff7900F4dA6BFa4eB41dBD6f2953ffb41b2B1;
        address D = 0x107Ff7900F4dA6BFa4eB41dBD6f2953ffb41b2B1;

        address[] mockSigners = [address(0xC), address(0xD)]; // Mock signer addresses
        address[] emptySigners = new address[](0);


    RealEstate boundEstate;
    Trade      boundTrade;
    function setUp() public {
        //deploy facets
       dCutFacet = new DiamondCutFacet();
        diamond = new Diamond(address(this), address(dCutFacet));
        dLoupe = new DiamondLoupeFacet();
        ownerF = new OwnershipFacet();
        realEstate = new RealEstate();
        trade = new Trade();

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

        A = mkaddr("signer A");
        B = mkaddr("signer B");

        boundEstate = RealEstate(address(diamond));
        boundTrade = Trade(address(diamond));
           diamond.setToken(A, B);



    }
       function testCreateListing() public {       
            vm.expectRevert(
            abi.encodeWithSelector(ERRORS.UNAUTHORIZED.selector)
        );

         boundEstate.createListing(address(0), "nigeria" ,"lagos", "ikorodu", "Ikorodu street", 0, "description", 10, "");
        
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


    function testCreatedListState() public {
        switchSigner(A);
        boundEstate.createListing(A, "nigeria" ,"lagos", "ikorodu", "estateAddress",0, "description", 10, "");
           LibAppStorage.Listing memory new_listing = boundEstate.getListing(0);
           assertEq(new_listing.owner, A);
           assertEq(new_listing.country, "nigeria");
           assertEq(new_listing.state, "lagos");
           assertEq(new_listing.city, "ikorodu");
           assertEq(new_listing.tokenId, 1);
      

    }

        function testEmptySignerPurchase() public {
      
        switchSigner(A);
        vm.expectRevert(
            abi.encodeWithSelector(ERRORS.INVALID_SIGNERS_COUNT.selector)
        );
        boundEstate.initiatePurchaseAgreement(1, A, emptySigners);

    }

    function testIsSignerValid() public {
           switchSigner(B);
        vm.expectRevert(
            abi.encodeWithSelector(ERRORS.INVALID_ENTITIES.selector)
        );
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
             vm.expectRevert(
            abi.encodeWithSelector(ERRORS.NOT_A_VALID_SIGNER.selector)
        );
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
         vm.stopPrank();
        
          switchSigner(address(0xD));

           boundEstate.signPurchaseAgreement(1);

             switchSigner(address(0xD));
             vm.expectRevert(
            abi.encodeWithSelector(ERRORS.ALREADY_SIGNED.selector)
        );
          
           boundEstate.signPurchaseAgreement(1);


       
    }
    // function testInitiatePurchase() public {
    //     switchSigner(A);
    //     boundEstate.initiatePurchaseAgreement(1, A, [C,D]);
    // }

/// Testing the Trade.sol
   function testEXHAUSTED_TOKEN_SHARE() public {
    uint tokenId = 100;  
    uint8 sharesToExceed = 101; 
    vm.expectRevert(
        abi.encodeWithSelector(ERRORS.EXHAUSTED_TOKEN_SHARES.selector)
    );
    boundTrade.buyNFTTokenShares(tokenId, sharesToExceed);
}


// function testINSUFFICIENT_BALANCE() public {
//     switchSigner(A);
//     vm.expectRevert(
//         abi.encodeWithSelector(ERRORS.INSUFFICIENT_BALANCE.selector)
//     );
//     boundTrade.buyNFTTokenShares(1, 1);
// }


    function testbuyNFTTokenShares() public {
        switchSigner(A);
        boundTrade.buyNFTTokenShares(1, 1);

    }


    function testINSUFFICIENT_SHARES() public {
        switchSigner(A);
        vm.expectRevert(
        abi.encodeWithSelector(ERRORS.INSUFFICIENT_SHARES.selector)
    );

        boundTrade.sellNFTTokenShares(1,1);
    }

    function testsellNFTTokenShares() public {
        switchSigner(A);
        boundTrade.buyNFTTokenShares(2,10);
        uint8 userShare = 2;
        boundTrade.sellNFTTokenShares(2,userShare);
    }

   


    function generateSelectors(
        string memory _facetName
    ) internal returns (bytes4[] memory selectors) {
        string[] memory cmd = new string[](3);
        cmd[0] = "node";
        cmd[1] = "scripts/genSelectors.js";
        cmd[2] = _facetName;
        bytes memory res = vm.ffi(cmd);
        selectors = abi.decode(res, (bytes4[]));
    }


    function mkaddr(string memory name) public returns (address) {
        address addr = address(
            uint160(uint256(keccak256(abi.encodePacked(name))))
        );
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

    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external override {}
}
