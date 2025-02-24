// "use client";

// import { useState, useEffect } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";
// import { getProvider, getProgram, getPdas, initializeAccounts } from "../utils/solana";
// import idl from "../idl.json";

// // Import WalletMultiButton for UI
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import "@solana/wallet-adapter-react-ui/styles.css";

// const TASK_PROGRAM_ID = new PublicKey(idl.metadata.address);

// export default function Tasks() {
//     const { publicKey, connected } = useWallet();
//     const [isAvailable, setIsAvailable] = useState(false);
//     const [receiver, setReceiver] = useState("");
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (connected && publicKey) {
//             initializeAccounts(publicKey); // Initialize necessary accounts
//             fetchTaskStatus();
//         }
//     }, [connected, publicKey]);

//     const fetchTaskStatus = async () => {
//         if (!publicKey) return;
        
//         try {
//             const provider = getProvider();
//             const program = getProgram(provider);
//             const { taskStatusPda } = getPdas(publicKey);

//             if (!taskStatusPda) {
//                 console.error("Error: taskStatusPda is undefined.");
//                 return;
//             }

//             const account = await program.account.taskStatus.fetch(taskStatusPda);
//             setIsAvailable(account.isAvailable);
//         } catch (error) {
//             console.error("Error fetching task status:", error);
//         }
//     };

//     const completeTask = async () => {
//         if (!publicKey) return alert("Connect your wallet first.");
//         if (!isAvailable) return alert("Task is not available.");
//         if (!receiver) return alert("Enter a valid receiver address.");

//         try {
//             setLoading(true);
//             const provider = getProvider();
//             const program = getProgram(provider);
//             const { userPda, taskStatusPda } = getPdas(publicKey);

//             if (!userPda || !taskStatusPda) {
//                 console.error("Error: PDAs not derived correctly.");
//                 return;
//             }

//             const transaction = await program.methods.completeTask()
//                 .accounts({
//                     userAccount: userPda,
//                     taskStatus: taskStatusPda,
//                     user: publicKey,
//                     receiver: new PublicKey(receiver),
//                     systemProgram: PublicKey.default,
//                 })
//                 .rpc();

//             console.log("Transaction Signature:", transaction);
//             alert("Task completed successfully!");
//             fetchTaskStatus(); // Refresh task status after completion
//         } catch (error) {
//             console.error("Error completing task:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="p-4 flex flex-col items-center">
//             <h1 className="text-xl font-bold mb-4">🔹 Task System</h1>

//             <WalletMultiButton />

//             <div className="mt-4 p-4 border rounded-lg shadow-md w-80">
//                 <p className="font-semibold">
//                     Task Available: {isAvailable ? "✅ Yes" : "❌ No"}
//                 </p>

//                 <input
//                     type="text"
//                     placeholder="Receiver Address"
//                     value={receiver}
//                     onChange={(e) => setReceiver(e.target.value)}
//                     className="mt-2 p-2 border rounded w-full"
//                 />

//                 <button
//                     onClick={completeTask}
//                     className={`mt-4 p-2 text-white rounded w-full ${loading ? "bg-gray-400" : "bg-blue-500"}`}
//                     disabled={loading}
//                 >
//                     {loading ? "Processing..." : "Complete Task"}
//                 </button>
//             </div>
//         </div>
//     );
// }


import BasicTasks from '@/components/basicTask'
import EngagementTasks from '@/components/engagementTask'
import HighImpactTasks from '@/components/highImpactTask'
import React from 'react'

function page() {
  return (
    <div>
      <h1>Tasks</h1>
      <p>This is the Tasks page.</p>
      <BasicTasks />
      <EngagementTasks />
      <HighImpactTasks />
    </div>
  )
}

export default page