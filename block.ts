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

	// Calculate the hash of the block
	calculateHash() {
		return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
	}

	// Mine the block
	mineBlock(difficulty: number) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
	}

	// Check if all transactions in the block are valid
	hasValidTransactions() {
		for (const tx of this.transactions as Transaction[]) {
			if (!tx.isValid()) {
				return false;
			}
		}

		return true;
	}
}
