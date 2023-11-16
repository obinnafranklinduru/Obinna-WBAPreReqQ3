import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

// Load the private key from the wallet file
const privateKeyUint8Array = new Uint8Array(wallet);

// Create a keypair using the loaded private key
const keypair = Keypair.fromSecretKey(privateKeyUint8Array);

// Establish a connection to the Solana devnet
const connection = new Connection("https://api.devnet.solana.com");

// Define an asynchronous function for the main logic
(async () => {
    try {
        // Request airdrop of 2 devnet SOL tokens
        const txhash = await connection.requestAirdrop(
            keypair.publicKey,
            2 * LAMPORTS_PER_SOL
        );

        // Log the success message with a link to the transaction on the Solana explorer
        console.log(`
            Success! Check out your TX here:
            \nhttps://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        // Log an error message if something goes wrong
        console.error(`Oops, something went wrong: ${e}`);
    }
})();