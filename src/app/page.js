"use client";

import dynamic from "next/dynamic";
import SolanaTokenCreationForm from "@/components/token-creation-form";
import TokenCreationGuide from "@/components/token-guide";
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

export default function Home() {
  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className=" bg-header px-20 py-10">
            <div className="flex justify-end" suppressHydrationWarning>
              <WalletMultiButtonDynamic />
            </div>
            <SolanaTokenCreationForm />
            <TokenCreationGuide />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
