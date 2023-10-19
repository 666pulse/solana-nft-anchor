import * as anchor from "@coral-xyz/anchor";

import {
  Idl,
  Program,
} from "@coral-xyz/anchor";

import {
  findMetadataPda,
  mplTokenMetadata,
  findMasterEditionPda,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

import {
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
  ParsedAccountData,
  Transaction,
  SystemProgram,
} from "@solana/web3.js"

import {
  walletAdapterIdentity
} from "@metaplex-foundation/umi-signer-wallet-adapters";

import {
  createUmi
} from "@metaplex-foundation/umi-bundle-defaults";

import {
  publicKey
} from "@metaplex-foundation/umi";

import idl from "./target/idl/solana_nft_anchor.json";
import privateKey from "~/.config/solana/id.json";

// export ANCHOR_WALLET=~/.config/solana/id.json
// export ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"

const programId = new PublicKey(""); //

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = new Program(idl as Idl, programId, provider);
  const signer = provider.wallet;
  const mint = anchor.web3.Keypair.generate();
  // const mint = anchor.web3.Keypair.fromSecretKey(new Uint8Array(privateKey))

  const mintaddress = mint.publicKey.toString()
  console.log("mint address: ", mintaddress);
  console.log();

  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    signer.publicKey
  );

  const umi = createUmi("https://api.devnet.solana.com")
    .use(walletAdapterIdentity(signer))
    .use(mplTokenMetadata());

  let metadataAccount = findMetadataPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  let masterEditionAccount = findMasterEditionPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  const metadata = {
    name: "nft",
    symbol: "nft",
    uri: "ipfs://bafkreigld2smzepuvshjx3knmbkzbuboeb657y7nxdpfkw7eeplkwt5snu",
  };

  // https://bafkreigld2smzepuvshjx3knmbkzbuboeb657y7nxdpfkw7eeplkwt5snu.ipfs.nftstorage.link/

  const tx = await program.methods
    .initNft(metadata.name, metadata.symbol, metadata.uri)
    .accounts({
      signer: provider.publicKey,
      mint: mint.publicKey,
      associatedTokenAccount,
      metadataAccount,
      masterEditionAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .signers([mint])
    .rpc();

    console.log(
      `mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
    console.log(
      `minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
    );
}

main()
