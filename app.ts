import { Blockchain } from "./chain";
import { Transaction } from "./transaction";

let simpleChain = new Blockchain();
simpleChain.createTransaction(new Transaction("addr1", "addr2", 50));
simpleChain.minePendingTransactions("patsn");

console.clear();
console.log(simpleChain);
console.log("Balance of addr1: ", simpleChain.getBalanceOfAddress("addr1"));
console.log("Balance of addr2: ", simpleChain.getBalanceOfAddress("addr2"));
