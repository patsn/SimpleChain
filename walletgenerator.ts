import elliptic from "elliptic";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const keyPair = ec.genKeyPair();

export const publicKey = keyPair.getPublic("hex");
export const privateKey = keyPair.getPrivate("hex");
