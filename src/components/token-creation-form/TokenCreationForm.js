"use client";

import {
  getMintLen,
  ExtensionType,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMetadataPointerInstruction,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { pinata } from "@/utils/config";

export function TokenCreationForm() {
  const NORMAL_FEES = 0.1;
  const REVOKE_UPDATE_FEES = 0.1;
  const REVOKE_FREEZE_FEES = 0.1;
  const REVOKE_MINT_FEES = 0.1;

  const [isRevokeUpdateChecked, setIsRevokeUpdateChecked] = useState(false);
  const [isRevokeFreezeChecked, setIsRevokeFreezeChecked] = useState(true);
  const [isRevokeMintChecked, setIsRevokeMintChecked] = useState(false);

  const [totalFees, setTotalFees] = useState(NORMAL_FEES);

  const wallet = useWallet();
  const { connection } = useConnection();

  async function mintTokens(tokenMintAccount, supply, decimals) {
    const associatedTokenAccount = getAssociatedTokenAddressSync(
      tokenMintAccount,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAccount,
        wallet.publicKey,
        tokenMintAccount,
        TOKEN_2022_PROGRAM_ID
      ),
      createMintToInstruction(
        tokenMintAccount,
        associatedTokenAccount,
        wallet.publicKey, // mint authority
        Number(supply) * Math.pow(10, Number(decimals)),
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction, connection);
  }

  async function uploadFile(file) {
    try {
      // setUploading(true);
      const keyRequest = await fetch("api/key");
      console.log(keyRequest);
      const keyData = await keyRequest.json();
      const upload = await pinata.upload.file(file).key(keyData.JWT);
      const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);
      // // setUrl(ipfsUrl);
      console.log(ipfsUrl);
      // // setUploading(false);
      return ipfsUrl;
    } catch (e) {
      console.log("error occurred");
      console.log(e);
      // setUploading(false);
      return null;
    }
  }

  async function uploadMetaData(data, ipfsUrl) {
    const metadata = {
      name: data.name,
      symbol: data.symbol,
      description: data.description,
      image: ipfsUrl,
    };

    try {
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload.json(metadata).key(keyData.JWT);
      const metadataUri = await pinata.gateways.convert(upload.IpfsHash);
      // setUrl(ipfsUrl);
      console.log(metadataUri);
      // setUploading(false);
      return metadataUri;
    } catch (e) {
      console.log(e);
      // setUploading(false);
      return null;
    }
  }

  function showLoading({ title, text }) {
    return Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  function showSuccess({ title, allowOutsideClick, showConfirmButton }) {
    return Swal.fire({
      title: title,
      icon: "success",
      showConfirmButton: allowOutsideClick,
      timer: 50000,
      allowOutsideClick: showConfirmButton,
    });
  }

  function showFailure({ title, msg }) {
    return Swal.fire({
      title: title,
      text: msg,
      icon: "error",
    });
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function createToken(data) {
    const keypair = Keypair.generate();
    showLoading({ title: "Uploading Image" });
    const ipfsUrl = await uploadFile(data?.image[0]);
    if (ipfsUrl == null) {
      showFailure({ title: "Trouble uploading file" });
      return;
    }
    showSuccess({
      title: "Image Uploaded to IPFS",
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    await sleep(3000);

    showLoading({ title: "Creating Token Metadata" });
    const metadataUri = await uploadMetaData(data, ipfsUrl);
    showLoading({ title: "Creating Token Mint" });
    await createTokenMint(data, metadataUri, keypair);
    showSuccess({ title: "Token Mint Created" });
    await sleep(3000);
    showLoading({ title: "Minting Tokens to your Wallet" });
    await mintTokens(keypair.publicKey, data.supply, data.decimals);
    showSuccess({
      title: "Tokens Minted",
      msg: "Tokens have been sent to your wallet.",
      allowOutsideClick: true,
      showConfirmButton: true,
    });
  }

  async function createTokenMint(data, uri, keypair) {
    const metadata = {
      updateAuthority: wallet.publicKey,
      mint: keypair.publicKey,
      name: data.name,
      symbol: data.symbol,
      uri: uri,
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = pack(metadata).length + TYPE_SIZE + LENGTH_SIZE;

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: keypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        keypair.publicKey,
        wallet.publicKey, // Authority that can set the metadata address, updateAuthority
        keypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        keypair.publicKey,
        Number(data.decimals), // decimals
        wallet.publicKey, // mint authprity
        wallet.publicKey, // freeze authority
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: keypair.publicKey,
        metadata: keypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey, // Designated Mint Authority
        updateAuthority: wallet.publicKey, // Authority that can update the metadata
      }),
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(process.env.NEXT_PUBLIC_VAULT),
        lamports: totalFees * Math.pow(10, 9),
      })
    );

    transaction.feePayer = wallet.publicKey;
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;

    transaction.partialSign(keypair);
    const trx = await wallet.sendTransaction(transaction, connection);

    console.log(trx);
    console.log(keypair.publicKey);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="font-BeVietnamPro">
      <form onSubmit={handleSubmit(createToken)}>
        <div className="bg-foreground p-4 flex flex-col items-center rounded-lg mt-10 mb-10 text-primary">
          <h1 className="text-base sm:text-4xl font-black mt-12">
            Solana Token Creator
          </h1>
          <p className="text-xs sm:text-base break-words">
            Easily Create your own Solana SPL Token without Coding.
          </p>

          <div className="grid md:grid-cols-2 w-2/3 gap-4 m-10 grid-cols-1 text-xs sm:text-base">
            <div className="flex flex-col">
              <p>
                {" "}
                <span className="text-red-600">*</span> Name :{" "}
              </p>
              <input
                className="p-2 mt-2 border-solid bg-foreground border-2 border-background rounded-lg"
                type="text"
                placeholder="Put the name of your token"
                {...register("name", { required: true, maxLength: 32 })}
              />
              {errors?.name?.type == "required" && (
                <p role="alert" className="text-red-600">
                  Name is required
                </p>
              )}
              {errors?.name?.type == "maxLength" && (
                <p role="alert" className="text-red-600">
                  No more than 32 characters
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <p>
                {" "}
                <span className="text-red-600">*</span> Symbol :{" "}
              </p>
              <input
                className="p-2 mt-2 border-solid bg-foreground border-background border-2 rounded-lg"
                type="text"
                placeholder="Put the symbol of your token"
                {...register("symbol", { required: true, maxLength: 8 })}
              />
              {errors?.symbol?.type == "required" && (
                <p role="alert" className="text-red-600">
                  Symbol is required
                </p>
              )}
              {errors?.symbol?.type == "maxLength" && (
                <p role="alert" className="text-red-600">
                  No more than 8 characters
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <p>
                {" "}
                <span className="text-red-600">*</span> Decimals :{" "}
              </p>
              <input
                className="p-2 mt-2 border-solid bg-foreground border-background border-2 rounded-lg"
                type="number"
                placeholder="Put the decimals of your token (min 0, max 9)"
                {...register("decimals", {
                  required: true,
                  min: 1,
                  max: 9,
                  value: 6,
                })}
              />
              {errors?.decimals?.type == "required" && (
                <p role="alert" className="text-red-600">
                  Decimals is required
                </p>
              )}
              {errors?.decimals?.type == "min" && (
                <p role="alert" className="text-red-600">
                  Minimum 1 is required
                </p>
              )}
              {errors?.decimals?.type == "max" && (
                <p role="alert" className="text-red-600">
                  Maximum allowed is 18
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <p>
                {" "}
                <span className="text-red-600">*</span> Supply :{" "}
              </p>
              <input
                className="p-2 mt-2 border-solid bg-foreground border-background border-2 rounded-lg"
                type="number"
                placeholder="Put the symbol of your token"
                {...register("supply", { required: true, min: 1, value: 1 })}
              />
              {errors?.supply?.type == "required" && (
                <p role="alert" className="text-red-600">
                  Supply is required
                </p>
              )}
              {errors?.supply?.type == "min" && (
                <p role="alert" className="text-red-600">
                  Minimum 1 is required
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <p>
                {" "}
                <span className="text-red-600">*</span> Image :{" "}
              </p>
              <input
                className="p-2 mt-2 border-solid bg-foreground border-background border-2 rounded-lg"
                type="file"
                accept="image/png, image/jpeg"
                placeholder="Upload image"
                {...register("image", { required: true })}
              />
              <p className="text-gray-400 text-xs sm:text-sm">
                Most meme coin use a squared 1000x1000 logo
              </p>
              {errors?.image?.type == "required" && (
                <p role="alert" className="text-red-600">
                  Image is required
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <p>
                {" "}
                <span className="text-red-600">*</span> Description :{" "}
              </p>
              <textarea
                className="p-2 mt-2 border-solid bg-foreground border-background border-2 rounded-lg"
                type="text"
                placeholder="Put the description of your token"
                rows={6}
                {...register("description", { required: true })}
              />
              {errors?.description?.type == "required" && (
                <p role="alert" className="text-red-600">
                  Description is required
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center flex-col w-2/3 mt-4 text-xs sm:text-base">
            <p className="text-xs sm:text-sm">Add social links (optional)</p>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 w-full mt-6">
              <div className="flex flex-col">
                <p> Website : </p>
                <input
                  className="p-2 mt-2 border-solid bg-foreground border-background border-2 rounded-lg"
                  type="text"
                  placeholder="Put your website"
                  {...register("website", { required: false })}
                />
              </div>

              <div className="flex flex-col">
                <p> Twitter : </p>
                <input
                  className="p-2 mt-2 border-solid bg-foreground border-background border-2 rounded-lg"
                  type="text"
                  placeholder="Put your twitter"
                  {...register("twitter", { required: false })}
                />
              </div>

              <div className="flex flex-col">
                <p> Telegram : </p>
                <input
                  className="p-2 mt-2 border-solid bg-foreground border-background border-2 rounded-lg"
                  type="text"
                  placeholder="Put your telegram"
                  {...register("telegram", { required: false })}
                />
              </div>

              <div className="flex flex-col">
                <p> Discord : </p>
                <input
                  className="p-2 mt-2 border-solid bg-foreground  border-background border-2 rounded-lg"
                  type="text"
                  placeholder="Put your discord"
                  {...register("discord", { required: false })}
                />
              </div>
            </div>
          </div>

          <p className="mt-10 text-xs sm:text-sm font-medium">
            Revoke Authorities
          </p>
          <p className="text-xs sm:text-sm text-gray mt-2 w-2/3">
            Solana Token have 3 authorities: Freeze Authority, Mint Authority
            and Update Authority. Revoke them to attract more investors.
          </p>

          <div className="grid md:grid-cols-3 grid-cols-1 w-2/3 mt-10 gap-4">
            <div>
              <label
                htmlFor="revoke-update"
                className="flex gap-2 items-center text-xs sm:text-sm"
              >
                <input
                  type="checkbox"
                  id="revoke-update"
                  className="h-4 w-4"
                  checked={isRevokeUpdateChecked}
                  onChange={(e) => {
                    if (!isRevokeUpdateChecked) {
                      setTotalFees(totalFees + REVOKE_UPDATE_FEES);
                    } else {
                      setTotalFees(totalFees - REVOKE_UPDATE_FEES);
                    }
                    setIsRevokeUpdateChecked(!isRevokeUpdateChecked);
                  }}
                />{" "}
                ( +{REVOKE_UPDATE_FEES} SOL )
              </label>
              <p className="text-sm sm:text-base font-medium">
                Revoke Update (Immutable)
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                Update Authority allows you to update token metadata
              </p>
            </div>

            <div>
              <label
                htmlFor="revoke-freeze"
                className="flex gap-2 items-center text-xs sm:text-sm"
              >
                <input
                  type="checkbox"
                  id="revoke-freeze"
                  className="h-4 w-4"
                  checked={isRevokeFreezeChecked}
                  onChange={(e) => {
                    if (!isRevokeFreezeChecked) {
                      setTotalFees(totalFees + REVOKE_FREEZE_FEES);
                    } else {
                      setTotalFees(totalFees - REVOKE_FREEZE_FEES);
                    }
                    setIsRevokeFreezeChecked(!isRevokeFreezeChecked);
                  }}
                />{" "}
                ( +{REVOKE_FREEZE_FEES} SOL )
              </label>
              <p className="text-sm sm:text-base font-medium">Revoke Freeze</p>
              <p className="text-xs sm:text-sm text-gray-400">
                Freeze Authority allows you to freeze token accounts. This is
                required if you want to create a liquidity pool.
              </p>
            </div>

            <div>
              <label
                htmlFor="revoke-mint"
                className="flex gap-2 items-center text-xs sm:text-sm"
              >
                <input
                  type="checkbox"
                  id="revoke-mint"
                  className="h-4 w-4"
                  checked={isRevokeMintChecked}
                  onChange={(e) => {
                    if (!isRevokeMintChecked) {
                      setTotalFees(totalFees + REVOKE_MINT_FEES);
                    } else {
                      setTotalFees(totalFees - REVOKE_MINT_FEES);
                    }
                    setIsRevokeMintChecked(!isRevokeMintChecked);
                  }}
                />{" "}
                ( +{REVOKE_MINT_FEES} SOL )
              </label>
              <p className="text-sm sm:text-base font-medium">Revoke Mint</p>
              <p className="text-xs sm:text-sm text-gray-400">
                Mint Authority allows you to mint more supply
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blueButton bg-secondary font-extrabold rounded-lg text-xs sm:text-base mt-10 hover:bg-darker_secondary"
          >
            Create Token
          </button>
          <p className="mt-3 text-base mb-10 ">
            Total Fees :{" "}
            <span className="text-darker_secondary">
              {totalFees.toFixed(2)} SOL
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
