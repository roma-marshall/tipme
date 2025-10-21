// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TipMe - User profiles + tips on-chain
/// @author
/// @notice Позволяет пользователям создавать профиль и получать чаевые
contract TipMe {
    // ---------- STRUCTS ----------
    struct Profile {
        string username;
        string bio;
        string x;
        string tg;
        string image;
    }

    struct Tip {
        address from;
        address to;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    // ---------- STORAGE ----------
    mapping(address => Profile) private profiles;
    mapping(address => Tip[]) private tipsByRecipient;

    // ---------- EVENTS ----------
    event ProfileUpdated(
        address indexed user,
        string username,
        string bio,
        string x,
        string tg,
        string image
    );

    event Tipped(
        address indexed from,
        address indexed to,
        uint256 amount,
        string message,
        uint256 timestamp
    );

    // ---------- FUNCTIONS ----------

    /// @notice Создать или обновить профиль пользователя
    function setProfile(
        string calldata username,
        string calldata bio,
        string calldata x,
        string calldata tg,
        string calldata image
    ) external {
        profiles[msg.sender] = Profile(username, bio, x, tg, image);
        emit ProfileUpdated(msg.sender, username, bio, x, tg, image);
    }

    /// @notice Получить профиль пользователя
    function getProfile(address user) external view returns (Profile memory) {
        return profiles[user];
    }

    /// @notice Отправить чаевые с сообщением
    function tip(address to, string calldata message) external payable {
        require(to != address(0), "invalid recipient");
        require(msg.value > 0, "no value");

        Tip memory t = Tip({
            from: msg.sender,
            to: to,
            amount: msg.value,
            message: message,
            timestamp: block.timestamp
        });

        tipsByRecipient[to].push(t);

        (bool ok, ) = to.call{value: msg.value}("");
        require(ok, "transfer failed");

        emit Tipped(msg.sender, to, msg.value, message, block.timestamp);
    }

    /// @notice Получить все чаевые для адреса
    function listTips(address recipient) external view returns (Tip[] memory) {
        return tipsByRecipient[recipient];
    }
}
