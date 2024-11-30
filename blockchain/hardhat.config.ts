import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const { SEPOLIA_RPC_URL, MNEMONIC, ETHERSCAN_API_KEY_SEPOLIA } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
  },
};

export default config;
