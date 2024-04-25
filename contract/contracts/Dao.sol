// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./interfaces/IRealEstate.sol";

/// @title  This contract serves as a DAO that validates and approves all property listings, potentially enabling a layered approval procedure..

contract Dao {
    //The address of the superior in the land and ministry administration who will provide the initial approval.
    address superior;
    //The address of the next higher authority in the land and ministry administration who will provide the second approval..
    address nextSuperior;
    // The address of the owners.
    address owner;
    // The address of the real estate contract that includes the function for creating listings..
    address realEstateContractAddress;
     
     /// @dev This struct holds all the necessary information for posting a real estate listing.
    struct Listing {
        address owner;
        address agentId;
        string country;
        string state;
        string city;
        string estateAddress;
        uint24 postalCode;
        string description;
        uint256 price;
        string images;
        string features;
        string coverImage;
        string id;
    }
   /// @dev This struct contains all the essential details for the designated agent.
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
        Agent[] agents;
    }
  /// @devThis struct contains all the required information for allocating listings to agents.
    struct Assign {
        Listing listing;
        uint timestamp;
        uint id;
        bool approved;
    }

  /// @dev A mapping that tracks the administrative entities.
    mapping(string => Administration) administration;

  /// @dev A mapping that keeps track of designated entities.
    mapping(string => Assign[]) assign;

/// The contructor set the initial value of a state variable in the contract,pointing to the real estate contract 
/// @param _realEstateContractAddress : This real estate contract address sets the initial address in the state variable to reference the real estate contract.
    constructor(address _realEstateContractAddress) {
        realEstateContractAddress = _realEstateContractAddress;
    }

/// transferStateSuperior  is designed to update the administration information for a given state by assigning a new superior address. 
/// @param state : The identified state for the next superior
/// @param _nextSuperior : The address of the next superior
    function transferStateSuperior(
        string calldata state,
        address _nextSuperior
    ) external {
        Administration storage _administration = administration[state];
        require(msg.sender == _administration.superior, "UNAUTHORIZED");
        _administration.nextSuperior = _nextSuperior;
    }

/// claimStateSuperior is designed to finalize the transfer of administrative authority for a specified state.
/// @param state : The identified state to tranfer administrative authority.
    function claimStateSuperior(string calldata state) external {
        Administration storage _administration = administration[state];
        require(msg.sender == _administration.nextSuperior, "UNAUTHORIZED");
        _administration.superior = msg.sender;
        _administration.nextSuperior = address(0);
    }

/// transferSuperior is designed to initiate a role transition by designating a new candidate for the next superior role within the adminstration.
/// @param _nextSuperior : The address of the new candidate for the next suprior within the adminstration
    function transferSuperior(address _nextSuperior) external {
        require(msg.sender == superior, "UNAUTHORIZED");
        nextSuperior = _nextSuperior;
    }

/// claimSuperior is designed to complete the transition of a  superior role within the adminstration
    function claimSuperior() external {
        require(nextSuperior == msg.sender, "UNAUTHORIZED");
        superior = msg.sender;
        nextSuperior = address(0);
    }

/// The createAdministration function is designed to create and configure 
/// a new administration entity based on administrative divisions such as states and regions. 
/// It is meant to set up a new administrative role with associated superior, state, and region attributes.
/// @param _administrationSuperior : The address of the new adminstration superior
/// @param _state :The designated state for the administration.
/// @param _region : The designated region for the adminstration.
    function createAdministration(
        address _administrationSuperior,
        string calldata _state,
        string calldata _region
    ) external {
        require(msg.sender == superior, "UNAUTHORIZED");
        require(_administrationSuperior != address(0), "INVALID_ADDRESS");
        require(
            keccak256(abi.encode(_state)) != keccak256(abi.encode("")),
            "INVALID_STATE_FIELD"
        );
        require(
            keccak256(abi.encode(_region)) != keccak256(abi.encode("")),
            "INVALID_REGION_FIELD"
        );
        Administration storage _administration = administration[_state];
        require(
            keccak256(abi.encode(_administration.region)) !=
                keccak256(abi.encode(_region)),
            "ALREDY_EXIST"
        );
        _administration.superior = _administrationSuperior;
        _administration.state = _state;
        _administration.region = _region;

        emit EVENTS.AdministrationCreated(
            adminSuperior,
            state,
            region
        );
    }
 
  /// The addAgent function is designed to add a new agent to an existing administration based on the state. 
  /// @param _state : The designated state for the administration
  /// @param _agent : The new instance of the agent struct.
    function addAgent(string calldata _state, Agent memory _agent) external {
        Administration storage _administration = administration[_state];
        require(msg.sender == _administration.superior, "UNAUTHORIZED");
        require(_agent.id == address(0), "INVALID_ADDRESS");
        require(
            keccak256(abi.encode(_agent.name)) != keccak256(abi.encode("")),
            "INVALID_NAME_FIELD"
        );
        require(
            keccak256(abi.encode(_agent.code)) != keccak256(abi.encode("")),
            "INVALID_CODE_FIELD"
        );
        require(
            keccak256(abi.encode(_agent.region)) != keccak256(abi.encode("")),
            "INVALID_REGION_FIELD"
        );
        require(
            keccak256(abi.encode(_agent.bio)) != keccak256(abi.encode("")),
            "INVALID_BIO_FIELD"
        );

        bool exist;
        for (uint i = 0; i < _administration.agents.length; i++) {
            if (_administration.agents[i].id == _agent.id) {
                exist = true;
            }

            if (
                keccak256(abi.encode(_administration.agents[i].code)) ==
                keccak256(abi.encode(_agent.code))
            ) {
                exist = true;
            }
        }
        require(!exist, "AGENT_ALREADY_EXIST(CODE_OR_ADDRESS)");
        require(
            keccak256(abi.encode(_administration.region)) !=
                keccak256(abi.encode(_agent.region)),
            "REGION_DID_NOT_MATCH"
        );
        _agent.deleted = false;
        _administration.agents.push(_agent);

        emit EVENTS.AgentRegistered(
            state,
            agent
        );
    }


/// The function delegateListingForApproval is designed to handle the process of delegating a real estate listing 
/// for approval within a specific state's administrative structure 
/// The function is interacting with the real estate function that handles the initiation of a listing approval
/// @param _state : The designated state for the listing approvals
/// @param hash : Hash of the listing details for integrity verification
/// @param _listing : The new instance of the listing struct.
    function delegateListingForApproval(
        string calldata _state,
        bytes32 hash,
        Listing calldata _listing
    ) external {
        require(msg.sender == owner, "UNAUTHORIZED");
        Administration storage _administration = administration[_state];

        require(_administration.superior != address(0), "STATE_NOT_REGISTERED");
        bool isValidAgent;

        for (uint i; i < _administration.agents.length; i++) {
            if (_administration.agents[i].id == _listing.agentId) {
                isValidAgent = true;
            }
        }
        require(isValidAgent, "NOT_A_VALID_AGENT");
        uint id = assign[_state].length;
        assign[_state].push(
            Assign({
                timestamp: block.timestamp,
                listing: _listing,
                id: id + 1,
                approved: false
            })
        );

        IRealEstate(realEstateContractAddress).queListingForApproval(
            _listing.id,
            hash,
            _administration.superior
        );
    }

/// The approveListing function is designed to finalize the approval of a real estate listing.
/// This function is part of administrative  system that uses administrative roles to manage and approve listings for real estate properties based on their geographical state.
/// @param _state : The designated state for the listing approvals
/// @param assignId : The Id for the assigned agent to approve listing 
/// @param listingId :The Id for the listings set to be approved.
    function approveListing(
        string calldata _state,
        uint assignId,
        string calldata listingId
    ) external {
        Administration storage _administration = administration[_state];
        require(msg.sender == _administration.superior, "UNAUTHORIZED");

        {
            Assign[] memory _assign = assign[_state];

            require(
                _assign.length > 0 && _assign.length >= assignId - 1,
                "INVALID_ASSIGN_ID"
            );
        }
        Assign storage _asign = assign[_state][assignId - 1];
        require(
            keccak256(abi.encode(_asign.listing.state)) ==
                keccak256(abi.encode(_state)),
            "STATE_DID_NOT_MATCH"
        );

        require(
            keccak256(abi.encode(_asign.listing.id)) ==
                keccak256(abi.encode(listingId)),
            "CORRUPTED_DATA"
        );

        _asign.approved = true;

        IRealEstate(realEstateContractAddress).createListing(
            _asign.listing.id,
            _asign.listing.owner,
            _asign.listing.agentId,
            _asign.listing.country,
            _state,
            _asign.listing.city,
            _asign.listing.estateAddress,
            _asign.listing.postalCode,
            _asign.listing.description,
            _asign.listing.price,
            _asign.listing.images,
            _asign.listing.coverImage,
            _asign.listing.features
        );

        emit EVENTS.ListingApproved(
            state,
            assignedId,
            listingId
        )
    }


/// The getUnApprovedAssigns function  is designed to retrieve a list of unapproved assignments for a specific state.
/// @param _state : The designated state to check for unapproved listings.
    function getUnApprovedAssigns(
        string calldata _state
    ) external view returns (Assign[] memory) {
        uint count;
        {
            for (uint i; i < assign[_state].length; i++) {
                if (!assign[_state][i].approved) {
                    count += 1;
                }
            }
        }

        Assign[] memory _return = new Assign[](count);

        {
            uint current_index;
            for (uint i; i < assign[_state].length; i++) {
                if (!assign[_state][i].approved) {
                    _return[current_index] = assign[_state][i];
                    current_index += 1;
                }
            }
        }

        return _return;
    }

/// The getApprovedAssigns function  is designed to retrieve a list of approved assignments for a specific state.
/// @param _state : The designated state to check for unapproved listings.
    function getApprovedAssigns(
        string calldata _state
    ) external view returns (Assign[] memory) {
        uint count;
        {
            for (uint i; i < assign[_state].length; i++) {
                if (assign[_state][i].approved) {
                    count += 1;
                }
            }
        }

        Assign[] memory _return = new Assign[](count);

        {
            uint current_index;
            for (uint i; i < assign[_state].length; i++) {
                if (assign[_state][i].approved) {
                    _return[current_index] = assign[_state][i];
                    current_index += 1;
                }
            }
        }

        return _return;
    }
}
