export default function TokenCreationGuide() {
  return (
    <div className="bg-foreground text-primary font-BeVietnamPro p-4 flex flex-col items-center rounded-lg text-base">
      <h1 className=" mt-20 text-4xl font-black">
        Solana Token Creation Guide
      </h1>
      <p className="w-1/2 mt-4">
        Effortlessly create your Solana SPL Token with our 1 step process – no
        coding required. Customize your Solana Token exactly the way you
        envision it. Less than 5 minutes, at an affordable cost.
      </p>
      <h1 className="text-xl mt-10 font-bold">
        How to use Solana Token Creator
      </h1>
      <div className="w-1/2">
        <p>1. Connect your Solana wallet.</p>
        <p>2. Specify the desired name for your Token</p>
        <p>3. Indicate the symbol (max 8 characters).</p>
        <p>
          4. Select the decimals quantity (0 for Whitelist Token, 5 for utility
          Token, 9 for meme token).
        </p>
        <p>5. Provide a brief description for your SPL Token.</p>
        <p>6. Upload the image for your token (PNG).</p>
        <p>7. Determine the Supply of your Token.</p>
        <p>
          8. Click on create, accept the transaction and wait until your tokens
          ready.
        </p>
        <p className="mt-4">
          The cost of Token creation is 0.1 SOL, covering all fees for SPL Token
          Creation.
        </p>
      </div>

      <h1 className="text-xl mt-10 p-2 font-bold ">Revoke Freeze Authority:</h1>
      <p className="w-1/2">
        If you want to create a liquidity pool you will need to "Revoke Freeze
        Authority" of the Token, you can do that here. The cost is 0.1 SOL.
      </p>

      <h1 className="text-xl mt-10 p-2 font-bold">Revoke Mint Authority:</h1>
      <p className="w-1/2">
        Revoking mint authority ensures that there can be no more tokens minted
        than the total supply. This provides security and peace of mind to
        buyers. The cost is 0.1 SOL
      </p>

      <br />

      <p className="w-1/2">
        Once the creation process starts, it will only take a few seconds! Once
        complete, you will receive the total supply of the token in your wallet.
      </p>

      <br />
      <p className="w-1/2">
        With our user-friendly platform, managing your tokens is simple and
        affordable. Using your wallet, you can easily create tokens, increase
        their supply, or freeze them as needed. Discover the ease of Solana
        Token creation with us
      </p>
      <br />
      <p className="w-1/2 mb-20">
        You can choose to revoke mint authority later if you choose.
      </p>
    </div>
  );
}
