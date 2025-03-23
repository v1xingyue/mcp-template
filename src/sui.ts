import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Secp256r1Keypair } from "@mysten/sui/keypairs/secp256r1";
import { CoinBalance, getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/dist/cjs/transactions";
import { bigint, z } from "zod";

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

export const getSuiBalance: ToolCallback = async () => {
  const pair = getSuiAccount();
  const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
  const balance: CoinBalance = await client.getBalance({
    owner: pair.toSuiAddress(),
    coinType: "0x2::sui::SUI",
  });

  return {
    content: [
      { type: "text", text: `Sui balance: ${JSON.stringify(balance)}` },
    ],
  };
};

const network = "mainnet";

export const getTransactionLink = (tx: string) => {
  if (network === "mainnet") {
    return `https://suivision.xyz/txblock/${tx}`;
  } else if (network === "testnet") {
    return `https://testnet.suivision.xyz/txblock/${tx}`;
  } else if (network === "devnet") {
    return `https://devnet.suivision.xyz/txblock/${tx}`;
  } else if (network === "localnet") {
    return `localhost : ${tx}`;
  }
};

export const transferArgs = {
  to: z.string(),
  amount: z.string(),
};

export const transferSui: ToolCallback<typeof transferArgs> = async (args) => {
  const pair = getSuiAccount();
  const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
  const tx = new Transaction();
  const coins = tx.splitCoins(tx.gas, [args.amount]);
  tx.transferObjects([coins], args.to);

  const result = await client.signAndExecuteTransaction({
    signer: pair,
    transaction: tx,
  });

  return {
    content: [
      {
        type: "text",
        text: `Transfer done, transaction link: ${getTransactionLink(
          result.digest
        )}`,
      },
    ],
  };
};
