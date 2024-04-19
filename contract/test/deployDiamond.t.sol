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

 contract DiamondDeployer is Test, IDiamondCut {

   // contract types of facets to be deployed
    Diamond diamond;
    DiamondCutFacet dCutFacet;
    DiamondLoupeFacet dLoupe;
    OwnershipFacet ownerF;
    RealEstate realEstate;

        address A = address(0xa);
        address B = address(0xb);

    function setUpp() public {
        //deploy facets
        dCutFacet = new DiamondCutFacet();
        diamond = new Diamond(address(this), address(dCutFacet));
        dLoupe = new DiamondLoupeFacet();
        ownerF = new OwnershipFacet();
        realEstate = new RealEstate(A,B);

        //upgrade diamond with facets

        //build cut struct
        FacetCut[] memory cut = new FacetCut[](3);

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

        cut[1] = (
            FacetCut({
                facetAddress: address(realEstate),
                action: FacetCutAction.Add,
                functionSelectors: generateSelectors("RealEstate")
            })
        );

        

        //upgrade diamond
        IDiamondCut(address(diamond)).diamondCut(cut, address(0x0), "");

        //call a function
        DiamondLoupeFacet(address(diamond)).facetAddresses();

        A = mkaddr("signer A");
        B = mkaddr("signer B");

        realEstate = RealEstate(address(diamond));


    }
      function testCreateListing() public {
        switchSigner(B);
        vm.expectRevert("INVALID_CONTRACT_ADDRESS");
        realEstate.createListing(address(0), "nigeria" ,"lagos", "ikorodu", "Ikorodu street", 0, "description", 10, "");
        
    }

       function testProposeBuy() public {
        switchSigner(A);
        realEstate.proposeBuy(0, 10);
        LibAppStorage.Proposal memory new_listing = realEstate.getProposal(0);
        assertEq(new_listing.estateId, 0);


    }
        function testPropose() public {
        switchSigner(A);
        realEstate.proposeBuy(0, 10);
        LibAppStorage.Proposal memory new_listing;
        assertGt(new_listing.estateId, 0);



    }
    function testCreatedListState() public {
        switchSigner(A);
        realEstate.createListing(address(0), "nigeria" ,"lagos", "ikorodu", "estateAddress",0, "description", 10, "");
           LibAppStorage.Listing memory new_listing = realEstate.getListing(0);
           assertEq(new_listing.owner, A);
           assertEq(new_listing.country, "nigeria");
           assertEq(new_listing.state, "lagos");
           assertEq(new_listing.city, "ikorodu");
           assertEq(new_listing.tokenId, 1);
      

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
