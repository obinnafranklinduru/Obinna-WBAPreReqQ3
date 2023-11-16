import {
    Transaction,
    SystemProgram, 
    Connection, 
    Keypair,
    LAMPORTS_PER_SOL, 
    sendAndConfirmTransaction, 
    PublicKey
} from "@solana/web3.js";

import wallet from "./dev-wallet.json";

// Import our dev wallet keypair from the wallet file
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define our WBA public key
const to = new PublicKey("ENR1GVHkLh7gUA6GxFnmT6afSJyQXqntVkQWJscqdc7J");

// Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        // Create a transaction instruction for a Solana transfer
        const transactionInstruction = SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: LAMPORTS_PER_SOL / 100,
        });

        // Create a transaction and add the instruction
        const transaction = new Transaction().add(transactionInstruction);

        // Set the recent blockhash for the transaction
        transaction.recentBlockhash = (await
            connection.getLatestBlockhash('confirmed')).blockhash;

        // Set the fee payer for the transaction
        transaction.feePayer = from.publicKey;

        // Sign the transaction, broadcast it, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        
        // Log success message with a link to the transaction on Solana explorer
        console.log(`
        Success! Check out your TX here:
        \nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();