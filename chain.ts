import { Block } from "./block";
import { Transaction } from "./transaction";

export class Blockchain {
	difficulty: number;
	blockChain: Block[];
	pendingTransactions: Transaction[];
	miningReward: number;

	constructor() {
		this.difficulty = 2;
		this.miningReward = 100;
		this.pendingTransactions = [];
		this.blockChain = [this.createGenesisBlock()];
	}

	createGenesisBlock() {
		return new Block("Genesis Block", "Genesis Block");
	}

	getLatestBlockHash() {
		return this.blockChain[this.blockChain.length - 1].hash;
	}

	createTransaction(transaction: Transaction) {
		this.pendingTransactions.push(transaction);
	}

	minePendingTransactions(miningRewardAddress: string) {
		let block = new Block(this.pendingTransactions, this.getLatestBlockHash());
		block.mineBlock(this.difficulty);
		console.log("Block successfully mined! " + block.hash);

		this.blockChain.push(block);

		this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
	}

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

	isChainValid() {
		for (let i = 1; i < this.blockChain.length; i++) {
			const currentBlock = this.blockChain[i];
			const previousBlock = this.blockChain[i - 1];

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
