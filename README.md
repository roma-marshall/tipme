# 💚 Tipme — decentralized tipping & creator reward app

**TipMe** is a Web3 dApp built on **Flow EVM** that lets users send and receive **crypto tips (FLOW / ETH)** directly on-chain.  
Creators can build public profiles, receive on-chain support, and earn NFT achievements — all powered by smart contracts.

---

## ✨ Features

- 💸 **Send & receive tips** — direct peer-to-peer transfers via the `TipJar` smart contract
- 🪪 **Public profiles** — wallet-based user pages with name, bio, and social links
- 🏆 **NFT Achievements** — collectible badges minted for actions like:
    - creating a profile
    - receiving first tip
    - sending large donations
- 🔒 **Self-custodial** — no intermediaries, funds remain on-chain
- 🌐 **Cross-chain ready** — currently deployed on **Flow EVM Mainnet** (EVM-compatible)

---

## 🧱 Tech Stack

| Layer | Technology                                                   |
|--------|--------------------------------------------------------------|
| **Frontend** | Nuxt 3 + Vue 3 + TailwindCSS + Reown (AppKit Wallet Connect) |
| **Smart Contracts** | Solidity + Hardhat + Ethers v6                               |
| **Blockchain** | Flow EVM Mainnet (chainId 747)                               |
| **Storage** | JSON metadata                     |
| **Hosting** | Vercel (`tipmeapp.vercel.app`)                                 |

---

## ⚙️ Project Structure
```
tipme/
├── contracts/ # Solidity contracts (TipJar, TipMe, NFTAchievements)
│ ├── scripts/ # Deployment scripts
│ └── hardhat.config.ts
└── frontend/
├── app/ # Nuxt application
│ ├── pages/ # index.vue, setup.vue, [address].vue, achievements.vue
│ ├── abi/ # Deployed contract ABIs + addresses
│ └── composables/ # useContract, useRpcProvider, useAchievements
├── public/
└── nuxt.config.ts
```

---

## 🧩 Smart Contracts

- [**TipJar.sol**](https://evm.flowscan.io/address/0x8A340f363aA0bcCaC7541502759E4B720685153e) — handles deposits, tipping, balances, and withdrawals
- [**TipMe.sol**](https://evm.flowscan.io/address/0xd85C2a5301aD353FdCBb7d0ce6f2494798A97c25) — manages user profiles and metadata
- [**NFTAchievements.sol**](https://evm.flowscan.io/address/0xc586A2CA2e0F4c3A268d0f9CE2c96AcEcf34aE02) — ERC-721 achievements with secure minting

---

## ✅ Verified Contracts

### 💰 TipJar.sol
- **Address:** [0x8A34...153e](https://evm.flowscan.io/address/0x8A340f363aA0bcCaC7541502759E4B720685153e?tab=contract)
- **Compiler:** 0.8.28
- **Network:** Flow EVM Mainnet
- **Verified:** ✅ Flowscan
- **Purpose:** Handles user tips, fee collection, and withdrawals

---

### 🌐 TipMe.sol
- **Address:** [0xd85C...7c25](https://evm.flowscan.io/address/0xd85C2a5301aD353FdCBb7d0ce6f2494798A97c25?tab=contract)
- **Compiler:** 0.8.28
- **Network:** Flow EVM Mainnet
- **Verified:** ✅ Flowscan
- **Purpose:** Core profile registry and dApp logic for TipMe

---

### 🏆 NFTAchievements.sol
- **Address:** [0xc586...aE02](https://evm.flowscan.io/address/0xc586A2CA2e0F4c3A268d0f9CE2c96AcEcf34aE02?tab=contract)
- **Compiler:** 0.8.28
- **Network:** Flow EVM Mainnet
- **Verified:** ✅ Flowscan
- **Purpose:** Mintable NFT badges for user achievements within TipMe

---

💚 Built with Hardhat 3 · OpenZeppelin 5 · Deployed on Flow EVM  
Part of the **#ReWTF** and **TipMe App** ecosystem.

---

## 📄 License
MIT License