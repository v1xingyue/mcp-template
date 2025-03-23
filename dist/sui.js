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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuiPrice = exports.getSuiBalance = exports.getSuiAddress = void 0;
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
const secp256k1_1 = require("@mysten/sui/keypairs/secp256k1");
const secp256r1_1 = require("@mysten/sui/keypairs/secp256r1");
const client_1 = require("@mysten/sui/client");
const suiPrivateKey = process.env.SUI_PRIVATE_KEY;
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
    var _a;
    const pair = loadFromSecretKey((_a = suiPrivateKey === null || suiPrivateKey === void 0 ? void 0 : suiPrivateKey.toString()) !== null && _a !== void 0 ? _a : "");
    return pair;
};
const getSuiAddress = () => __awaiter(void 0, void 0, void 0, function* () {
    const pair = getSuiAccount();
    return {
        content: [{ type: "text", text: `Sui address: ${pair.toSuiAddress()}` }],
    };
});
exports.getSuiAddress = getSuiAddress;
const getSuiBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    const pair = getSuiAccount();
    const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)("mainnet") });
    const balance = yield client.getBalance({
        owner: pair.toSuiAddress(),
        coinType: "0x2::sui::SUI",
    });
    return {
        content: [{ type: "text", text: `Sui balance: ${balance}` }],
    };
});
exports.getSuiBalance = getSuiBalance;
const getSuiPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        content: [{ type: "text", text: `Sui price: 100` }],
    };
});
exports.getSuiPrice = getSuiPrice;
