// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Ghostlycoin.sol";

/// @title Token Sale contract for Ghostlycoin
/// @author Shivam Patel
/// @notice 
/// @dev followed a tutorial from Dapp University on Youtube
contract GhostlycoinSale{
    //admin isn't public because we don't want to expose the admin address
    address admin;
    Ghostlycoin public tokenContract;
    uint256 public tokenPrice;

    constructor(Ghostlycoin _tokenContract, uint256 _tokenPrice) public{
        //the admin will be the person who deploys this contract
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

}