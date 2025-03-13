// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TokenizedDeposit {
    string public name = "Tokenized Deposit";
    string public symbol = "TDEP";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * (10 ** uint256(decimals));
        balances[msg.sender] = totalSupply; // Allocate all tokens to deployer
    }

    function transfer(address _to, uint256 _amount) public returns (bool success) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function mint(address _to, uint256 _amount) public returns (bool success) {
        balances[_to] += _amount;
        totalSupply += _amount;
        emit Transfer(address(0), _to, _amount);
        return true;
    }
}
