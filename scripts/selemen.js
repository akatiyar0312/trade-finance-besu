import Web3 from "web3";
import fs from "fs";
import path from "path";

// Load bank accounts
const accountFile = path.join(__dirname, "bankAccounts.json");
const accounts = JSON.parse(fs.readFileSync(accountFile, "utf-8"));

// Connect to Besu
const web3 = new Web3(new Web3.providers.HttpProvider("http://YOUR_BESU_NODE_IP:8545"));

// Load contract
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, "contractAddress.json"), "utf-8"));
const contractPath = path.join(__dirname, "build", "TokenizedDeposit.json");
const { abi } = JSON.parse(fs.readFileSync(contractPath, "utf-8"));
const contract = new web3.eth.Contract(abi, contractData.address);

// Function to transfer CBDC between banks
const settlePayment = async () => {
    const bankA = accounts.bankA;
    const bankB = accounts.bankB;
    const centralBank = accounts.centralBank;

    // Add account private keys to wallet
    web3.eth.accounts.wallet.add(centralBank.privateKey);
    web3.eth.accounts.wallet.add(bankA.privateKey);
    web3.eth.accounts.wallet.add(bankB.privateKey);

    console.log("📌 Bank A Address:", bankA.address);
    console.log("📌 Bank B Address:", bankB.address);
    
    // Central Bank mints tokens for Bank A
    await contract.methods.mint(bankA.address, web3.utils.toWei("100000", "ether"))
        .send({ from: centralBank.address, gas: 500000 });

    console.log("✅ Central Bank issued $100,000 to Bank A");

    // Bank A settles $50,000 to Bank B
    await contract.methods.transfer(bankB.address, web3.utils.toWei("50000", "ether"))
        .send({ from: bankA.address, gas: 500000 });

    console.log("✅ Bank A settled $50,000 to Bank B");
};

// Execute settlement
settlePayment();
