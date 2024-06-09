import { Block } from "./block";
import { Transaction } from "./transaction";

export class Blockchain {
	difficulty: number;
	blockChain: Block[];
	pendingTransactions: Transaction[];
	miningReward: number;

	constructor(difficulty: number = 2, miningReward: number = 100) {
		this.difficulty = difficulty;
		this.miningReward = miningReward;
		this.pendingTransactions = [];
		this.blockChain = [this.createGenesisBlock()];
	}

	// Create the Genesis Block
	createGenesisBlock() {
		return new Block("Genesis Block", "Genesis Block");
	}

	// Get the latest block in the chain
	getLatestBlockHash() {
		return this.blockChain[this.blockChain.length - 1].hash;
	}

	// Add a new transaction to the pending transactions array
	addTransaction(transaction: Transaction) {
		if (!transaction.fromAddress || !transaction.toAddress) {
			throw new Error("Transaction must include from and to address");
		}

		if (!transaction.isValid()) {
			throw new Error("Cannot add invalid transaction to chain");
		}

		this.pendingTransactions.push(transaction);
	}

	// Mine the pending transactions
	minePendingTransactions(miningRewardAddress: string) {
		let block = new Block(this.pendingTransactions, this.getLatestBlockHash());
		block.mineBlock(this.difficulty);

		this.blockChain.push(block);

		this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
	}

	// Get the balance of an address (wallet)
	getBalanceOfAddress(address: string) {
		let balance = 0;
		for (const block of this.blockChain) {
			for (const trans of block.transactions) {
				// Check if the transaction is not the "Genesis Block"
				if (typeof trans !== "string") {
					if (trans.fromAddress === address) {
						balance -= trans.amount;
					}
					if (trans.toAddress === address) {
						balance += trans.amount;
					}
				}
			}
		}

		return balance;
	}

	// Check if the chain is valid
	isChainValid() {
		for (let i = 1; i < this.blockChain.length; i++) {
			const currentBlock = this.blockChain[i];
			const previousBlock = this.blockChain[i - 1];

			if (!currentBlock.hasValidTransactions()) {
				return false;
			}

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}

		return true;
	}
}
