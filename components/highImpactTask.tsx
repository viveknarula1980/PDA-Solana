"use client";
import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl, Commitment } from '@solana/web3.js';
import { Program, AnchorProvider, web3, Idl } from '@project-serum/anchor';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import idl from '../idl/idl.json';

const programID = new PublicKey("H7gmtUmi4yVY2ATjEZQ8328WxdrsSMpqGBbkkw85E4Mm");
const network = clusterApiUrl('devnet');
const opts: web3.ConfirmOptions = { preflightCommitment: "processed" as Commitment };
// const idl: Idl = idlData as Idl;

const HighImpactTasks = () => {
  const wallet = useAnchorWallet();
  const [taskStatus, setTaskStatus] = useState<Record<string, boolean>>(
    JSON.parse(localStorage.getItem('highImpactTaskStatus') || '{}')
  );
  const [recipientAddress, setRecipientAddress] = useState("");
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

  const tasks = [
    'Deploy a Sample Smart Contract',
    'Stake SOL for at Least 7 Days',
    'Mint and Transfer an NFT',
    'Provide Liquidity to a Protocol',
    'Run a Validator Node for 24 Hours',
    'Contribute Code to an Open-Source Project'
  ];

  useEffect(() => {
    setAllTasksCompleted(tasks.every(task => taskStatus[task]));
    localStorage.setItem('highImpactTaskStatus', JSON.stringify(taskStatus));
  }, [taskStatus]);

  const getProvider = () => {
    if (!wallet) throw new Error("Wallet not connected");
    const connection = new Connection(network, opts);
    return new AnchorProvider(connection, wallet, opts);
  };

  const sendReward = async () => {
    try {
      if (!recipientAddress) throw new Error("Recipient address is required");
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const payer = wallet?.publicKey;
      if (!payer) throw new Error("Wallet not connected");
      const recipient = new PublicKey(recipientAddress);
      
      await program.rpc.sendReward({
        accounts: {
          payer,
          recipient,
          systemProgram : web3.SystemProgram.programId
        }
      });
      console.log("Reward Sent Successfully");
    } catch (error) {
      console.error("Transaction Failed", error);
    }
  };

  const handleTaskCompletion = async (task: string) => {
    setTaskStatus((prevStatus) => {
      const newStatus = { ...prevStatus, [task]: true };
      localStorage.setItem('highImpactTaskStatus', JSON.stringify(newStatus));
      return newStatus;
    });
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-gray-100 max-w-lg mx-auto">
      <WalletMultiButton className={`mb-4 ${allTasksCompleted ? '' : 'opacity-50 cursor-not-allowed'}`} disabled={!allTasksCompleted} />
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">High-Impact Tasks</h2>
      <form className="space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 ${taskStatus[task] ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
              onClick={() => handleTaskCompletion(task)}
              disabled={taskStatus[task]}
            >
              {taskStatus[task] ? '✅ Completed' : task}
            </button>
          </div>
        ))}
      </form>
      {allTasksCompleted && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter recipient address"
            className="w-full p-3 border rounded-lg mb-3 text-gray-700"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <button className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-purple-600" onClick={sendReward}>Claim Reward</button>
        </div>
      )}
    </div>
  );
};

export default HighImpactTasks;