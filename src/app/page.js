"use server";

import SolanaTokenCreationForm from "@/components/token-creation-form";
import TokenCreationGuide from "@/components/token-guide";

export default async function Home() {
  return (
    <div className="bg-background p-8">
      <div className="flex justify-center" suppressHydrationWarning>
        <SolanaTokenCreationForm />
      </div>
      <div className="flex justify-center">
        <TokenCreationGuide />
      </div>
    </div>
  );
}
