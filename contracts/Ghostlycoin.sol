// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/// @title Ghostlycoin implements ERC-20
/// @author Shivam Patel
/// @notice this coin does nothing. It's for learning purposes
/// @dev followed a tutorial from Dapp University on Youtube
contract Ghostlycoin{

    string public name = "Ghostlycoin";
    //GSC = GHOSTLYSHOT COIN :)
    string public symbol = "GSC";
    string public standard = "Ghostlycoin v1.0";
    //we need a way to set the total number of tokens
    //we need a way to read the total number of tokens
    uint256 public totalSupply;

    //consumers can subscribe to this event
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );


    mapping(address=> uint256) public balanceOf;



    /* Constructor
    * note - local function variables start with an _
    */
    constructor(uint256 _initialSupply) public{ 
        //this variable is a state variable, which is visible to the entire contract
        totalSupply = _initialSupply;
        //allocate the initial supply 
        //msg is a global variable in Solidity
        //sender is the address of the sender who calls this function
        balanceOf[msg.sender] = _initialSupply;
    }

    /* Transfer
    * has a Transfer event and throws an Exception if account doesn't have enough 
    * returns a boolean
    */
    function transfer(address _to, uint256 _value) public returns(bool success){
        //in solidity, we can have a require keyword to allow the rest of the code to execute only if the condition is true; otherwise throws error
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        //to fire an event in solidity, just call it's name
        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}