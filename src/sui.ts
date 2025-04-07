import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Secp256r1Keypair } from "@mysten/sui/keypairs/secp256r1";
import { CoinBalance, getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { z } from "zod";

type Network = "mainnet" | "testnet" | "devnet" | "localnet";

const suiPrivateKey = process.env.SUI_PRIVATE_KEY;

type KeypairMethod = {
  Class:
    | typeof Ed25519Keypair
    | typeof Secp256k1Keypair
    | typeof Secp256r1Keypair;
  method: "deriveKeypairFromSeed" | "deriveKeypair";
};

const loadFromMnemonics = (mnemonics: string) => {
  const keypairMethods: KeypairMethod[] = [
    { Class: Ed25519Keypair, method: "deriveKeypairFromSeed" },
    { Class: Secp256k1Keypair, method: "deriveKeypair" },
    { Class: Secp256r1Keypair, method: "deriveKeypair" },
  ];
  for (const { Class, method } of keypairMethods) {
    try {
      return (Class as any)[method](mnemonics);
    } catch {
      // Removed unnecessary continue
    }
  }
  throw new Error("Failed to derive keypair from mnemonics");
};

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
  try {
    const pair = loadFromSecretKey(suiPrivateKey?.toString() ?? "");
    return pair;
  } catch (error) {
    return loadFromMnemonics(suiPrivateKey?.toString() ?? "");
  }
};

export const getSuiAddress: ToolCallback = async () => {
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
  } catch (error) {
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
};

export const getSuiBalance: ToolCallback = async () => {
  const pair = getSuiAccount();
  const client = new SuiClient({ url: getFullnodeUrl(network as Network) });
  const balance: CoinBalance = await client.getBalance({
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
};

const network = process.env.SUI_NETWORK ?? "mainnet";

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
