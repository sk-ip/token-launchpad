"use client";

import dynamic from "next/dynamic";

import { TokenCreationForm } from "./TokenCreationForm";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function SolanaTokenCreationForm() {
  return (
    <ConnectionProvider
      endpoint={
        "https://solana-mainnet.g.alchemy.com/v2/0Jr9auvM7TxENEA07kD41B9FIl7TBzKL"
      }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="bg-background w-4/5">
            <div className="flex justify-end" suppressHydrationWarning>
              <WalletMultiButtonDynamic />
            </div>
            <TokenCreationForm />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
