import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import constants from "./constants";

const PickWinner = () => {
  const [manager, setManager] = useState(""); // Store manager's address
  const [contractInstance, setContractInstance] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [winner, setWinner] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setCurrentAccount(address);
          console.log("Connected account:", address);

          // Initialize contract
          const contract = new ethers.Contract(
            constants.contractAddress,
            constants.contractABI,
            signer
          );
          setContractInstance(contract);

          // Fetch contract data
          const contractManager = await contract.getManager();
          setManager(contractManager);

          const contractStatus = await contract.status();
          setStatus(contractStatus);

          const contractWinner = await contract.getWinner();
          setWinner(contractWinner);

          // Check if the connected user is the manager
          setIsManager(contractManager.toLowerCase() === address.toLowerCase());
        } catch (err) {
          console.error("Error connecting to MetaMask:", err);
        }
      } else {
        alert("Please install MetaMask.");
      }
    };

    load();
  }, []);

  const pickWinner = async () => {
    if (!contractInstance) return;
    try {
      const tx = await contractInstance.pickWinner();
      await tx.wait();
      alert("Winner has been picked!");
    } catch (err) {
      console.error("Error picking winner:", err);
    }
  };

  return (
    <div className="container">
      <h1>Lottery Results</h1>
      <div className="button-container">
        {status ? (
          <p>Lottery winner: {winner !== ethers.constants.AddressZero ? winner : "No winner yet"}</p>
        ) : isManager ? (
          <button className="enter-button" onClick={pickWinner}>
            Pick Winner
          </button>
        ) : (
          <p>You are not the manager.</p>
        )}
      </div>
    </div>
  );
};

export default PickWinner;
