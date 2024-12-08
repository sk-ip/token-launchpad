export default function TokenCreationGuide() {
  return (
    <div className="bg-background text-white p-4 flex flex-col items-center rounded-lg">
      <h1 className=" mt-10 text-4xl font-bold underline">
        Solana Token Creation Guide
      </h1>
      <p className="w-1/2 mt-4">
        Effortlessly create your Solana SPL Token with our 1 step process – no
        coding required. Customize your Solana Token exactly the way you
        envision it. Less than 5 minutes, at an affordable cost.
      </p>
      <h1 className="text-xl mt-10">How to use Solana Token Creator</h1>
      <ul>
        <li>1. Connect your Solana wallet.</li>
        <li>2. Specify the desired name for your Token</li>
        <li>3. Indicate the symbol (max 8 characters).</li>
        <li>
          4. Select the decimals quantity (0 for Whitelist Token, 5 for utility
          Token, 9 for meme token).
        </li>
        <li>5. Provide a brief description for your SPL Token.</li>
        <li>6. Upload the image for your token (PNG).</li>
        <li>7. Determine the Supply of your Token.</li>
        <li>
          8. Click on create, accept the transaction and wait until your tokens
          ready.
        </li>
        <li>
          The cost of Token creation is 0.1 SOL, covering all fees for SPL Token
          Creation.
        </li>
      </ul>

      <h1 className="text-xl mt-10 p-2 ">Revoke Freeze Authority:</h1>
      <p className="w-1/2">
        If you want to create a liquidity pool you will need to "Revoke Freeze
        Authority" of the Token, you can do that here. The cost is 0.1 SOL.
      </p>

      <h1 className="text-xl mt-10 p-2">Revoke Mint Authority:</h1>
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
        You can choose to revoke mint authority later if you choose
      </p>
    </div>
  );
}
