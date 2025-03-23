import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Secp256r1Keypair } from "@mysten/sui/keypairs/secp256r1";

const suiPrivateKey = process.env.SUI_PRIVATE_KEY;

const loadFromSecretKey = (privateKey: string) => {
  const keypairClasses = [Ed25519Keypair, Secp256k1Keypair, Secp256r1Keypair];
  for (const KeypairClass of keypairClasses) {
    try {
      return KeypairClass.fromSecretKey(privateKey);
    } catch {
      // Removed unnecessary continue
    }
  }
  throw new Error("Failed to initialize keypair from secret key");
};

const getSuiAccount = () => {
  const pair = loadFromSecretKey(suiPrivateKey?.toString() ?? "");
  return pair;
};

export const getSuiAddress: ToolCallback = async () => {
  const pair = getSuiAccount();
  return {
    content: [{ type: "text", text: `Sui address: ${pair.toSuiAddress()}` }],
  };
};

export const getSuiPrice: ToolCallback = async () => {
  return {
    content: [{ type: "text", text: `Sui price: 100` }],
  };
};
