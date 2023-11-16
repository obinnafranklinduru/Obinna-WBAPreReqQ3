import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider, Address } from "@project-serum/anchor";
import { WbaPrereq, IDL } from "./programs/wba_prereq";
import wallet from "./wba-wallet.json";
import bs58 from "bs58";

// Extract the base58 encoded secret key from the wallet
const base58EncodedSecretKey = wallet.secretKey;
const secretKeyUint8Array = bs58.decode(base58EncodedSecretKey);

// Create a keypair from the secret key
const keypair = Keypair.fromSecretKey(secretKeyUint8Array);

// Establish a connection to the Solana devnet
const connection = new Connection("https://api.devnet.solana.com");

// Github account
const github = Buffer.from("obinnafranklinduru", "utf8");

// Create our Anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed"
});

// Create our program instance using the WbaPrereq IDL and program ID
const program = new Program<WbaPrereq>(IDL, "HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1" as Address, provider);

// Create the PDA for our enrollment account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);

// Execute our enrollment transaction
(async () => {
    try {
        // Call the 'complete' method of the WbaPrereq program
        const txhash = await program.methods
            .complete(github)
            .accounts({
                signer: keypair.publicKey,
                prereq: enrollment_key,
                systemProgram: SystemProgram.programId,
            })
            .signers([
                keypair
            ]).rpc();

        // Log success message with a link to the transaction on Solana explorer
        console.log(`
            Success! Check out your TX here:
            \nhttps://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();