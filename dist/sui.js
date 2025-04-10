"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferSui = exports.transferArgs = exports.getTransactionLink = exports.getSuiBalance = exports.getSuiAddress = void 0;
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
const secp256k1_1 = require("@mysten/sui/keypairs/secp256k1");
const secp256r1_1 = require("@mysten/sui/keypairs/secp256r1");
const client_1 = require("@mysten/sui/client");
const transactions_1 = require("@mysten/sui/transactions");
const zod_1 = require("zod");
const suiPrivateKey = process.env.SUI_PRIVATE_KEY;
const loadFromMnemonics = (mnemonics) => {
    const keypairMethods = [
        { Class: ed25519_1.Ed25519Keypair, method: "deriveKeypairFromSeed" },
        { Class: secp256k1_1.Secp256k1Keypair, method: "deriveKeypair" },
        { Class: secp256r1_1.Secp256r1Keypair, method: "deriveKeypair" },
    ];
    for (const { Class, method } of keypairMethods) {
        try {
            return Class[method](mnemonics);
        }
        catch (_a) {
            // Removed unnecessary continue
        }
    }
    throw new Error("Failed to derive keypair from mnemonics");
};
const loadFromSecretKey = (privateKey) => {
    const keypairClasses = [ed25519_1.Ed25519Keypair, secp256k1_1.Secp256k1Keypair, secp256r1_1.Secp256r1Keypair];
    for (const KeypairClass of keypairClasses) {
        try {
            return KeypairClass.fromSecretKey(privateKey);
        }
        catch (_a) {
            // Removed unnecessary continue
        }
    }
    throw new Error("Failed to initialize keypair from secret key");
};
const getSuiAccount = () => {
    var _a, _b;
    try {
        const pair = loadFromSecretKey((_a = suiPrivateKey === null || suiPrivateKey === void 0 ? void 0 : suiPrivateKey.toString()) !== null && _a !== void 0 ? _a : "");
        return pair;
    }
    catch (error) {
        return loadFromMnemonics((_b = suiPrivateKey === null || suiPrivateKey === void 0 ? void 0 : suiPrivateKey.toString()) !== null && _b !== void 0 ? _b : "");
    }
};
const getSuiAddress = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pair = getSuiAccount();
        return {
            content: [
                {
                    type: "text",
                    text: `Sui address: ${pair.toSuiAddress()} network: ${network}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error} . You can generate a sui account as documents : https://docs.sui.io/guides/developer/cryptography/multisig#create-addresses-with-different-schemes`,
                    isError: true,
                },
            ],
        };
    }
});
exports.getSuiAddress = getSuiAddress;
const getSuiBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    const pair = getSuiAccount();
    const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)(network) });
    const balance = yield client.getBalance({
        owner: pair.toSuiAddress(),
        coinType: "0x2::sui::SUI",
    });
    return {
        content: [
            {
                type: "text",
                text: `Sui balance: 
        coinType : ${balance.coinType} 
        coinObject count: ${balance.coinObjectCount}
        totalBalance: ${Number(balance.totalBalance) / 10 ** 9}
        `,
            },
        ],
    };
});
exports.getSuiBalance = getSuiBalance;
const network = (_a = process.env.SUI_NETWORK) !== null && _a !== void 0 ? _a : "mainnet";
const getTransactionLink = (tx) => {
    if (network === "mainnet") {
        return `https://suivision.xyz/txblock/${tx}`;
    }
    else if (network === "testnet") {
        return `https://testnet.suivision.xyz/txblock/${tx}`;
    }
    else if (network === "devnet") {
        return `https://devnet.suivision.xyz/txblock/${tx}`;
    }
    else if (network === "localnet") {
        return `localhost : ${tx}`;
    }
};
exports.getTransactionLink = getTransactionLink;
exports.transferArgs = {
    to: zod_1.z.string(),
    amount: zod_1.z.string(),
};
const transferSui = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const pair = getSuiAccount();
    const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)("mainnet") });
    const tx = new transactions_1.Transaction();
    const coins = tx.splitCoins(tx.gas, [args.amount]);
    tx.transferObjects([coins], args.to);
    const result = yield client.signAndExecuteTransaction({
        signer: pair,
        transaction: tx,
    });
    return {
        content: [
            {
                type: "text",
                text: `Transfer done, transaction link: ${(0, exports.getTransactionLink)(result.digest)}`,
            },
        ],
    };
});
exports.transferSui = transferSui;
