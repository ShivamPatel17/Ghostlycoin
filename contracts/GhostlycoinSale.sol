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
    uint256 public tokensSold;

    event Sell(
        address _buyer,
        uint256 _amount
    );

    constructor(Ghostlycoin _tokenContract, uint256 _tokenPrice) public{
        //the admin will be the person who deploys this contract
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;        
    }
    
    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y==0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        //need self destruct but payable address doesn't work
    }


}