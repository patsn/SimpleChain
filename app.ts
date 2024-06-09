import { Blockchain } from "./chain";
import { Transaction } from "./transaction";
import elliptic from "elliptic";
import { privateKey, publicKey } from "./walletgenerator";

const EC = elliptic.ec;
const ec = new EC("secp256k1");
console.clear();

// Create a new instance of the Blockchain class
const difficulty = 2;
const miningReward = 100;
let simpleChain = new Blockchain(difficulty, miningReward);

// Create a new transaction
const myKey = ec.keyFromPrivate(privateKey);
const transaction1 = new Transaction(publicKey, "toAddress", 10);
transaction1.signTransaction(myKey);

// Add the transaction to the pending transactions array
simpleChain.addTransaction(transaction1);

// Mine the pending transactions
simpleChain.minePendingTransactions("minerAddress");

console.log(simpleChain);
console.log("Is chain valid? " + simpleChain.isChainValid());
console.log("My balance: " + simpleChain.getBalanceOfAddress(publicKey));
