// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

interface ERC20Interface {
    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function mint(address to, uint tokens) external returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
}

contract Token is ERC20Interface {
    string public symbol = "STC";
    string public name = "Strongcoin Token";
    uint8 public decimals = 18;
    uint private _totalSupply;

    address public crowdfundingContract;
    mapping(address => uint) private balances;

    modifier onlyCrowdfunding() {
        require(msg.sender == crowdfundingContract, "Caller is not authorized");
        _;
    }

    constructor() {
        _totalSupply = 0;
    }

    function setCrowdfundingContract(address _crowdfundingContract) external {
        require(crowdfundingContract == address(0), "Crowdfunding contract already set");
        crowdfundingContract = _crowdfundingContract;
    }

    function mint(address to, uint tokens) external onlyCrowdfunding returns (bool success) {
        _totalSupply += tokens;
        balances[to] += tokens;
        emit Transfer(address(0), to, tokens);
        return true;
    }

    function totalSupply() public view override returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public view override returns (uint balance) {
        return balances[tokenOwner];
    }
}
