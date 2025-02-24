import { useState } from "react";
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button, Input } from "@/components/ui/button";

// 🔹 Solana Network
const NETWORK = "https://api.devnet.solana.com";

// 🔹 Sender Wallet (Replace with your keypair for testing)
const SENDER_KEYPAIR = Keypair.fromSecretKey(Uint8Array.from([
    /* 🔹 Replace with your private key array */
]));

// 🔹 Public Key for Display
const SENDER_PUBLIC_KEY = new PublicKey("5gB5HBEDsh3JS7EvC77NDh92FwXqStvXYU18jJKFkqTS");

export default function SendTransaction() {
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState("");

    // 🔹 Send SOL Transaction
    const sendTransaction = async () => {
        if (!receiver || !amount) {
            window.alert("⚠️ Enter a valid receiver and amount");
            return;
        }

        try {
            const connection = new Connection(NETWORK, "confirmed");
            const recipient = new PublicKey(receiver);
            const lamports = Number(amount) * LAMPORTS_PER_SOL;

            // 🔹 Create Transaction
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: SENDER_PUBLIC_KEY,
                    toPubkey: recipient,
                    lamports: lamports,
                })
            );

            // 🔹 Sign and Send Transaction
            const signature = await sendAndConfirmTransaction(connection, transaction, [SENDER_KEYPAIR]);

            console.log("✅ Transaction successful! Signature:", signature);

            // 🔹 Ensure alert appears on frontend
            setTimeout(() => {
                window.alert(`🎉 Transaction Successful!\nSignature: ${signature}`);
            }, 100); // Small delay to allow UI update

        } catch (error) {
            console.error("❌ Error sending transaction:", error);
            window.alert("❌ Transaction Failed! Please try again.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Send SOL</h1>
            <Input
                type="text"
                placeholder="Receiver Address"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="mt-2 p-2 border rounded"
            />
            <Input
                type="number"
                placeholder="Amount (SOL)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 p-2 border rounded"
            />
            <Button onClick={sendTransaction} className="mt-4">Send Transaction</Button>
        </div>
    );
}
