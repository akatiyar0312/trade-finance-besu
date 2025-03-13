import Web3 from "web3";
import fs from "fs";
import path from "path";

// Load bank accounts
const accountFile = path.join(__dirname, "bankAccounts.json");
const accounts = JSON.parse(fs.readFileSync(accountFile, "utf-8"));

// Connect to Besu Node
const web3 = new Web3(new Web3.providers.HttpProvider("http://34.57.7.67:8545"));
// Load contract ABI and bytecode
const contractPath = path.join(__dirname, "build", "TokenizedDeposit.json");
const { abi, bytecode } = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

// Deploy contract using Central Bank account
const deployContract = async () => {
    const centralBank = accounts.centralBank;
    web3.eth.accounts.wallet.add(centralBank.privateKey);

    const contract = new web3.eth.Contract(abi);
    const deployedContract = await contract.deploy({ data: "0x" + bytecode, arguments: [1000000] })
        .send({ from: centralBank.address, gas: 5000000 });

    console.log("✅ Contract Deployed at:", deployedContract.options.address);

    // Save contract address
    fs.writeFileSync(path.join(__dirname, "contractAddress.json"), JSON.stringify({ address: deployedContract.options.address }));
};

deployContract();
