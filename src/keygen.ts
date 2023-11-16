import { Keypair } from "@solana/web3.js";

// Function to generate a new Solana wallet keypair
(() => {
    // Generate a new keypair
    const kp = Keypair.generate();

    // Log the generated wallet information
    console.log(`
        You've generated a new Solana wallet:
        \nPublic Key: ${kp.publicKey.toBase58()} 
        \nPrivate Key: [${kp.secretKey}]
    `);
})()