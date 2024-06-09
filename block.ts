import { SHA256 } from "crypto-js";
import { Transaction } from "./transaction";

export class Block {
	transactions: Transaction[] | "Genesis Block";
	timestamp: Date;
	previousHash: string;
	hash: string;
	nonce: number;

	constructor(transactions: Transaction[] | "Genesis Block", previousHash: string) {
		this.timestamp = new Date();
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
	}

	mineBlock(difficulty: number) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log("Block mined: " + this.hash);
	}
}
