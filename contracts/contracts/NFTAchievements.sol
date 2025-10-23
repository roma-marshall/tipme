// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTAchievements
 * @notice ERC721 on-chain achievement NFTs for TipMe users.
 * Each achievement has predefined name, description, and image stored in the contract.
 */
contract NFTAchievements is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    struct AchievementMeta {
        string name;
        string description;
        string image;
    }

    // id → metadata
    mapping(string => AchievementMeta) public achievements;
    // user → achievementId → minted?
    mapping(address => mapping(string => bool)) public hasMinted;

    event AchievementMinted(address indexed user, string achievementId, uint256 tokenId);

    constructor(address initialOwner)
    ERC721("TipMe Achievements", "TIPACHV")
    Ownable(initialOwner)
    {
        // initialize predefined achievements
        achievements["profile"] = AchievementMeta(
            "Profile Creator",
            "Created your TipMe profile.",
            "https://tipme.app/achievements/profile.png"
        );
        achievements["first_tip"] = AchievementMeta(
            "First Tip",
            "Sent your first tip to another user.",
            "https://tipme.app/achievements/first_tip.png"
        );
        achievements["big_donor"] = AchievementMeta(
            "Generous Donor",
            "Sent a tip worth more than 0.1 ETH.",
            "https://tipme.app/achievements/big_donor.png"
        );
        achievements["ten_tips"] = AchievementMeta(
            "10 Tips Sent",
            "Sent at least 10 tips.",
            "https://tipme.app/achievements/ten_tips.png"
        );
        achievements["fee_helper"] = AchievementMeta(
            "Fee Helper",
            "Tipped when a platform fee was active.",
            "https://tipme.app/achievements/fee_helper.png"
        );
        achievements["top_supporter"] = AchievementMeta(
            "Top 1% Supporter",
            "Joined the top 1% of TipMe donors.",
            "https://tipme.app/achievements/top_supporter.png"
        );
    }

    /**
     * @notice Mint an achievement NFT by ID (on-chain metadata)
     */
    function mintAchievement(string memory achievementId) external {
        require(!hasMinted[msg.sender][achievementId], "Already minted");
        AchievementMeta memory meta = achievements[achievementId];
        require(bytes(meta.name).length > 0, "Achievement not found");

        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);

        string memory json = string(
            abi.encodePacked(
                '{"name":"',
                meta.name,
                '","description":"',
                meta.description,
                '","image":"',
                meta.image,
                '"}'
            )
        );

        string memory base64Json = string(
            abi.encodePacked("data:application/json;base64,", _base64(bytes(json)))
        );

        _setTokenURI(tokenId, base64Json);
        hasMinted[msg.sender][achievementId] = true;

        emit AchievementMinted(msg.sender, achievementId, tokenId);
    }

    /**
     * @notice Owner can update or add new achievements
     */
    function setAchievement(
        string memory id,
        string memory name,
        string memory description,
        string memory image
    ) external onlyOwner {
        achievements[id] = AchievementMeta(name, description, image);
    }

    // --- internal Base64 encoder ---
    function _base64(bytes memory data) internal pure returns (string memory) {
        string memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        if (len == 0) return "";
        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen + 32);
        bytes memory table = bytes(TABLE);

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                out := shl(8, out)
                out := add(out, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                out := shl(8, out)
                out := add(out, mload(add(tablePtr, and(input, 0x3F))))
                mstore(resultPtr, shl(224, out))
                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}
