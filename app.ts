import { Blockchain } from "./chain";
import { Transaction } from "./transaction";
import elliptic from "elliptic";
import { keyPair } from "./walletgenerator";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const privateKey = keyPair.getPrivate("hex");
const publicKey = keyPair.getPublic("hex");

const difficulty: number = 2;
const miningReward: number = 100;

console.clear();

// Create a new instance of the Blockchain class
let simpleChain = new Blockchain(difficulty, miningReward);

// Create a new transaction
const myKey = ec.keyFromPrivate(privateKey);

const transaction1 = new Transaction(publicKey, "toAddress", 10);
transaction1.signTransaction(myKey);

const transaction2 = new Transaction(publicKey, "toAddress", 20);
transaction2.signTransaction(myKey);

// Add the transactions to the pending transactions array
simpleChain.addTransaction(transaction1);
simpleChain.addTransaction(transaction2);

// Mine the pending transactions
simpleChain.minePendingTransactions("minerAddress");

console.log("---------------------------------");
console.dir(simpleChain, { depth: null });
console.log("---------------------------------");

const balanceInfo = [
	{ Address: "publicKey", Balance: simpleChain.getBalanceOfAddress(publicKey) },
	{ Address: "toAddress", Balance: simpleChain.getBalanceOfAddress("toAddress") },
	{ Address: "minerAddress", Balance: simpleChain.getBalanceOfAddress("minerAddress") },
	{ Address: "minerAddress (to come)", Balance: simpleChain.getBalanceToCome("minerAddress") },
];
// Display the balance information in a table
console.table(balanceInfo);
