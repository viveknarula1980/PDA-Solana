"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getProvider, getProgram } from "../../utils/solana";
import idl from "../../idl.json";

// Import WalletMultiButton for wallet connection UI
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css"; // Ensure default styles load
import BasicTasks from "@/components/basicTask";

const TASK_PROGRAM_ID = new PublicKey("EjEJ9n8YohfJa1HXGWJGfvS8cHxFNyQBXxXWuc7PYAaJ");

export default function Tasks() {
    const { publicKey, sendTransaction } = useWallet();
    const [isAvailable, setIsAvailable] = useState(false);
    const [receiver, setReceiver] = useState("");

    useEffect(() => {
        if (publicKey) fetchTaskStatus();
    }, [publicKey]);

    const fetchTaskStatus = async () => {
        try {
            const provider = getProvider();
            const program = getProgram(provider);
            const [taskStatusPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("task")],
                TASK_PROGRAM_ID
            );
            
            const account = await program.account.taskStatus.fetch(taskStatusPda);
            setIsAvailable(account.isAvailable);
        } catch (error) {
            console.error("Error fetching task status:", error);
        }
    };

    const completeTask = async () => {
        if (!publicKey) return alert("Connect your wallet first");
        if (!isAvailable) return alert("Task is not available");
        if (!receiver) return alert("Enter a valid receiver address");
        
        try {
            const provider = getProvider();
            const program = getProgram(provider);

            const [userPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("user"), publicKey.toBuffer()],
                TASK_PROGRAM_ID
            );
            const [taskStatusPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("task")],
                TASK_PROGRAM_ID
            );

            const transaction = await program.methods.completeTask()
                .accounts({
                    userAccount: userPda,
                    taskStatus: taskStatusPda,
                    user: publicKey,
                    receiver: new PublicKey(receiver),
                    systemProgram: PublicKey.default,
                })
                .signers([])
                .rpc();

            console.log("Transaction Signature:", transaction);
            alert("Task completed successfully!");
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    return (
        <>
        <div>
            <BasicTasks />
        </div><div className="p-4">
                <h1 className="text-xl font-bold">Tasks</h1>

                {/* Wallet Connection Button */}
                <div className="my-4">
                    <WalletMultiButton />
                </div>

                <p>Task Available: {isAvailable ? "✅ Yes" : "❌ No"}</p>
                <input
                    type="text"
                    placeholder="Receiver Address"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    className="mt-2 p-2 border rounded" />
                <button onClick={completeTask} className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Complete Task
                </button>
            </div></>
    );
}
