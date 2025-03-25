import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // ✅ Correct Import

import constants from "./constants";

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [status, setStatus] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setCurrentAccount(address);
          console.log("Connected account:", address);

          // Contract Initialization
          const contract = new ethers.Contract(
            constants.contractAddress,
            constants.contractABI,
            signer
          );
          setContractInstance(contract);

          // Fetch Contract Status
          const contractStatus = await contract.status();
          setStatus(contractStatus);

          // Check if user is winner
          const winner = await contract.getWinner();
          setIsWinner(winner.toLowerCase() === address.toLowerCase());
        } catch (err) {
          console.error("Error connecting to MetaMask:", err);
        }
      } else {
        alert("Please install MetaMask.");
      }
    };

    load();
  }, []);

  const enterLottery = async () => {
    if (!contractInstance) return;
    try {
      const tx = await contractInstance.enter({
        value: ethers.utils.parseEther("0.001"),
      });
      await tx.wait();
      alert("You have entered the lottery!");
    } catch (err) {
      console.error("Error entering lottery:", err);
    }
  };

  const claimPrize = async () => {
    if (!contractInstance) return;
    try {
      const tx = await contractInstance.claim();
      await tx.wait();
      alert("Prize Claimed!");
    } catch (err) {
      console.error("Error claiming prize:", err);
    }
  };

  return (
    <div className="container">
      <h2>Welcome to the Lottery</h2>
      <div className="button-container">
        {status ? (
          isWinner ? (
            <button className="enter-button" onClick={claimPrize}>
              Claim Prize
            </button>
          ) : (
            <p>You are not the winner</p>
          )
        ) : (
          <button className="enter-button" onClick={enterLottery}>
            Enter Lottery
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
