// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import "./Token.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Crowdfunding is ERC721URIStorage {
    Token public token;
    uint256 public nftCounter;

    struct Investor {
        uint8 investorType; // 1 for Type 1, 2 for Type 2
        uint256 amount;
    }

    mapping(address => Investor) public investors;

    event InvestorRegistered(address indexed investor, uint8 investorType, uint256 amount);
    event NFTMinted(address indexed recipient, uint256 tokenId, string tokenURI);

    constructor(address tokenAddress) ERC721("CrowdFund NFT", "CFNFT") {
        token = Token(tokenAddress);
        nftCounter = 0;
    }

    function invest(uint8 investorType, uint256 amount, string memory nftURI) external {
        require(investorType == 1 || investorType == 2, "Invalid investor type");
        require(amount > 0, "Investment amount must be greater than zero");

        if (investors[msg.sender].amount > 0) {
            investors[msg.sender].amount += amount;
        } else {
            investors[msg.sender] = Investor(investorType, amount);
        }

        uint256 tokenReward;
        if (investorType == 1) {
            tokenReward = amount * 5;
            token.mint(msg.sender, tokenReward);
        } else if (investorType == 2) {
            tokenReward = amount * 10;
            token.mint(msg.sender, tokenReward);

            if (investors[msg.sender].amount == amount) {
                nftCounter++;
                _safeMint(msg.sender, nftCounter);
                _setTokenURI(nftCounter, nftURI);
                emit NFTMinted(msg.sender, nftCounter, nftURI);
            }
        }

        emit InvestorRegistered(msg.sender, investorType, amount);
    }
}
