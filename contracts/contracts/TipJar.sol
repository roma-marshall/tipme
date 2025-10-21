// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * TipJar – общий контракт для получения чаевых в ETH.
 *  • все средства хранятся в контракте в виде балансов пользователей;
 *  • владелец получает только комиссию;
 *  • поддерживаются пауза и защита от повторных вызовов.
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TipJar is Ownable, Pausable, ReentrancyGuard {
    /// минимальная сумма чаевых
    uint256 public constant MIN_TIP = 0.001 ether;

    /// комиссия в базисных пунктах (500 = 5 %)
    uint16 public feeBps = 500;

    /// максимально допустимая комиссия (10 %)
    uint16 public constant MAX_FEE_BPS = 10000;

    /// накопленные комиссии проекта
    uint256 public feesAccrued;

    /// балансы получателей чаевых
    mapping(address => uint256) public balances;

    // ----------- события -----------
    event TipSent(address indexed from, address indexed to, uint256 gross, uint256 fee, uint256 net);
    event Withdraw(address indexed user, uint256 amount);
    event FeesWithdrawn(address indexed to, uint256 amount);
    event FeeUpdated(uint16 oldFee, uint16 newFee);

    // ----------- конструктор -----------
    constructor(address initialOwner) Ownable(initialOwner) {}

    // ----------- пользовательские функции -----------

    /// @notice Отправить чаевые получателю `to`
    function tip(address to) external payable whenNotPaused nonReentrant {
        require(to != address(0), "invalid recipient");
        require(msg.value >= MIN_TIP, "tip too small");

        (uint256 fee, uint256 net) = _splitFee(msg.value);
        balances[to] += net;
        feesAccrued += fee;

        emit TipSent(msg.sender, to, msg.value, fee, net);
    }

    /// @notice Вывести все свои чаевые
    function withdrawMyTips() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "nothing to withdraw");

        balances[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "withdraw failed");

        emit Withdraw(msg.sender, amount);
    }

    // ----------- функции владельца -----------

    /// @notice Изменить комиссию (в bps, 500 = 5 %)
    function setFeeBps(uint16 newFeeBps) external onlyOwner {
        require(newFeeBps <= MAX_FEE_BPS, "fee too high");
        uint16 old = feeBps;
        feeBps = newFeeBps;
        emit FeeUpdated(old, newFeeBps);
    }

    /// @notice Вывести накопленные комиссии проекта
    function withdrawFees(address payable to) external onlyOwner nonReentrant {
        require(to != address(0), "invalid address");
        uint256 amount = feesAccrued;
        require(amount > 0, "no fees");

        feesAccrued = 0;
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "fee withdraw failed");

        emit FeesWithdrawn(to, amount);
    }

    /// @notice Приостановить приём чаевых
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Возобновить работу
    function unpause() external onlyOwner {
        _unpause();
    }

    // ----------- view / internal -----------

    /// @notice Подсчёт комиссии и нетто-суммы
    function quote(uint256 gross) external view returns (uint256 fee, uint256 net) {
        return _splitFee(gross);
    }

    function _splitFee(uint256 gross) internal view returns (uint256 fee, uint256 net) {
        fee = (gross * feeBps) / 10_000;
        net = gross - fee;
    }

    // ----------- защита от прямых переводов -----------

    receive() external payable {
        revert("use tip()");
    }

    fallback() external payable {
        revert("use tip()");
    }
}
