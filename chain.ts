import { Block } from "./block";
import { Transaction } from "./transaction";

export class Blockchain {
	difficulty: number;
	chain: Block[];
	pendingTransactions: Transaction[];
	miningReward: number;

	constructor(difficulty: number = 2, miningReward: number = 100) {
		this.difficulty = difficulty;
		this.miningReward = miningReward;
		this.pendingTransactions = [];
		this.chain = [this.createGenesisBlock()];
	}

	// Create the Genesis Block
	private createGenesisBlock(): Block {
		return new Block("Genesis Block", "Genesis Block");
	}

	// Get the latest block in the chain
	private getLatestBlockHash(): string {
		return this.chain[this.chain.length - 1].hash;
	}

	// Add a new transaction to the pending transactions array
	public addTransaction(transaction: Transaction): void {
		if (!transaction.fromAddress || !transaction.toAddress) {
			throw new Error("Transaction must include from and to address");
		}

		if (!transaction.isValid()) {
			throw new Error("Cannot add invalid transaction to chain");
		}

		this.pendingTransactions.push(transaction);
	}

	// Mine the pending transactions
	public minePendingTransactions(miningRewardAddress: string): void {
		if (this.pendingTransactions.length === 0) {
			throw new Error("No pending transactions to mine");
		}
		let block = new Block(this.pendingTransactions, this.getLatestBlockHash());
		block.mineBlock(this.difficulty);

		this.chain.push(block);

		this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
	}

	// Get the balance of an address (wallet)
	public getBalanceOfAddress(address: string): number {
		let balance = 0;
		for (const block of this.chain) {
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

	public getBalanceToCome(address: string): number {
		let balance = 0;
		for (const singleTransaction of this.pendingTransactions) {
			if (singleTransaction.fromAddress === address) {
				balance -= singleTransaction.amount;
			}
			if (singleTransaction.toAddress === address) {
				balance += singleTransaction.amount;
			}
		}
		return balance;
	}

	// Check if the chain is valid
	public isChainValid(): boolean {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

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
