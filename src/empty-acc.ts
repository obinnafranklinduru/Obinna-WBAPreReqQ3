import {
    Transaction,
    SystemProgram, 
    Connection, 
    Keypair, 
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
        // Get balance of dev wallet
        const balance = await connection.getBalance(from.publicKey);

        // Create a test transaction to calculate fees
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance,
            })
        );

        // Set the recent blockhash for the transaction
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        
        // Set the fee payer for the transaction
        transaction.feePayer = from.publicKey;

        // Calculate the exact fee rate to transfer the entire SOL amount out of the account minus fees
        const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;

        // Remove the original transfer instruction to replace it
        transaction.instructions.pop();

        // Add the instruction back with the correct amount of lamports
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            })
        );

        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );

        // Log success message with a link to the transaction on Solana explorer
        console.log(`
            Success! Check out your TX here:
            \nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
        );
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();