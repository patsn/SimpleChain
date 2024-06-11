import elliptic from "elliptic";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

export const keyPair: elliptic.ec.KeyPair = ec.genKeyPair();
