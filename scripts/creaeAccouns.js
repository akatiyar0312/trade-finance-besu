import Web3 from "web3";
import fs from "fs";
import path from "path";

// Connect to Besu Node
const web3 = new Web3(new Web3.providers.HttpProvider("http://34.57.7.67:8545"));

// Function to create a new account
const createAccount = (bankName) => {
    const account = web3.eth.accounts.create();
    return { name: bankName, address: account.address, privateKey: account.privateKey };
};

// Generate accounts for Central Bank, Bank A, and Bank B
const accounts = {
    centralBank: createAccount("Central Bank"),
    bankA: createAccount("Bank A"),
    bankB: createAccount("Bank B"),
};

// Save accounts to a file
const accountFile = path.join(__dirname, "bankAccounts.json");
fs.writeFileSync(accountFile, JSON.stringify(accounts, null, 2));

console.log("✅ Accounts created successfully and saved to", accountFile);
console.log(accounts);
