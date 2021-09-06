// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Ghostlycoin{

    //we need a way to set the total number of tokens
    //we need a way to read the total number of tokens
    uint256 public totalSupply;

    constructor() public{ 
        //this variable is a state variable, which is visible to the entire contract
        totalSupply = 1000000;
    }
}