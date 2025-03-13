const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Connect to Besu
const web3 = new Web3("http://34.57.7.67:8545");  // Corrected Web3 initialization


// Load Contract ABI and Bytecode
const contractPath = path.join(__dirname, 'output', 'BillOfExchange_sol_BillOfExchange');
const abi = JSON.parse(fs.readFileSync(contractPath + '.abi', 'utf-8'));
const bytecode = fs.readFileSync(contractPath + '.bin', 'utf-8');

// Deploy the contract
const deployContract = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Deploying from account:", accounts[0]);

    const contract = new web3.eth.Contract(abi);
    
    const deployedContract = await contract.deploy({ data: '0x' + bytecode })
        .send({ from: accounts[0], gas: 5000000 });

    console.log("✅ Contract deployed at:", deployedContract.options.address);
};

deployContract();
