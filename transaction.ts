import { SHA256 } from "crypto-js";
import elliptic from "elliptic";
const EC = elliptic.ec;
const ec = new EC("secp256k1");

export class Transaction {
	fromAddress: string | null;
	toAddress: string;
	amount: number;
	signature: string | null;

	constructor(fromAddress: string | null, toAddress: string, amount: number) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
		this.signature = null;
	}

	// Calculate the hash of the transaction
	calculateHash() {
		return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
	}

	// Sign the transaction with a private key
	signTransaction(signingKey: any) {
		if (signingKey.getPublic("hex") !== this.fromAddress) {
			throw new Error("You cannot sign transactions for other wallets!");
		}

		const hashTransaction = this.calculateHash();
		const signature = signingKey.sign(hashTransaction, "base64");
		this.signature = signature.toDER("hex");
	}

	// Check if the signature is valid
	isValid() {
		if (this.fromAddress === null) return true;

		if (!this.signature || this.signature.length === 0) {
			throw new Error("No signature in this transaction");
		}

		const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
		return publicKey.verify(this.calculateHash(), this.signature);
	}
}
