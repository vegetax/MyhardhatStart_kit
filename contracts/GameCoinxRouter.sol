//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

error Unauthorized();

//0x17d6fae16dffd29267eeb20b0f08c106c4059309  GAMECOINx   for constructor
// 0x50b6e4ae7b6Ab45e255463876e4c25949C8704A2  GAMEROUTER
contract GameCoinxRouter {
    // ---------------------------------------------------------------------------------------------
    // STATE VARIABLES

    /// @notice Owner.
    address public owner;
    /// @notice CFA Library.
    using CFAv1Library for CFAv1Library.InitData;
    CFAv1Library.InitData public cfaV1;

    /// @notice Allow list.
    mapping(address => bool) public accountList;
    ISuperToken supertoken;
    ISuperfluidToken token;

    constructor(ISuperToken _supertoken, ISuperfluidToken _token) {
        supertoken = _supertoken;
        token = _token;
        owner = msg.sender;
        // Initialize CFA Library
        ISuperfluid host = ISuperfluid(
            0xEB796bdb90fFA0f28255275e16936D25d3418603
        ); //mumbai HOST
        cfaV1 = CFAv1Library.InitData(
            host,
            IConstantFlowAgreementV1(
                address(
                    host.getAgreementClass(
                        keccak256(
                            "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
                        )
                    )
                )
            )
        );
    }

    //获取flow rate
    function getFlowRate(address _receiver) external view returns (int96) {
        (, int96 outFlowRate, , ) = cfaV1.cfa.getFlow(
            supertoken,
            address(this),
            _receiver
        );
        return outFlowRate;
    }

    /// @notice Add account to allow list.
    /// @param _account Account to allow.
    function allowAccount(address _account) external {
        if (msg.sender != owner) revert Unauthorized();

        accountList[_account] = true;
    }

    /// @notice Removes account from allow list.
    /// @param _account Account to disallow.
    function removeAccount(address _account) external {
        if (msg.sender != owner) revert Unauthorized();

        accountList[_account] = false;
    }

    /// @notice Transfer ownership.
    /// @param _newOwner New owner account.
    function changeOwner(address _newOwner) external {
        if (msg.sender != owner) revert Unauthorized();

        owner = _newOwner;
    }

    function createFlowFromContract(address receiver, int96 flowRate) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        cfaV1.createFlow(receiver, token, flowRate);
    }

    function updateFlowFromContract(address receiver, int96 flowRate) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        cfaV1.updateFlow(receiver, token, flowRate);
    }

    function deleteFlowFromContract(address receiver) external {
        if (!accountList[msg.sender] && msg.sender != owner)
            revert Unauthorized();

        cfaV1.deleteFlow(address(this), receiver, token);
    }
}
