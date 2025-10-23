// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTAchievements
 * @dev ERC721 контракт для ачивок TipMe, каждая NFT уникальна для пользователя и ачивки.
 * Поддерживает установку tokenURI при минта и безопасную передачу владения.
 */
contract NFTAchievements is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    // предотвращает повторный минт одной и той же ачивки
    mapping(address => mapping(string => bool)) public hasMinted;

    event AchievementMinted(address indexed user, string achievementId, uint256 tokenId, string tokenURI);

    constructor() ERC721("TipMe Achievements", "TMA") Ownable(msg.sender) {}

    /**
     * @notice Минтит NFT-аивку с уникальным tokenURI
     * @param achievementId - ID ачивки (например "profile", "first_tip" и т.д.)
     * @param tokenURI_ - ссылка на JSON метаданные (например https://tipme.app/achievements/profile.json)
     */
    function mintAchievement(string memory achievementId, string memory tokenURI_) external {
        require(!hasMinted[msg.sender][achievementId], "Already minted this achievement");

        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        hasMinted[msg.sender][achievementId] = true;
        emit AchievementMinted(msg.sender, achievementId, tokenId, tokenURI_);
    }

    /**
     * @notice Проверка, минтил ли юзер конкретную ачивку
     */
    function hasUserMinted(address user, string memory achievementId) external view returns (bool) {
        return hasMinted[user][achievementId];
    }

    /**
     * @notice Админ может вручную установить tokenURI (например для редактирования)
     */
    function updateTokenURI(uint256 tokenId, string memory newURI) external onlyOwner {
        _setTokenURI(tokenId, newURI);
    }
}
