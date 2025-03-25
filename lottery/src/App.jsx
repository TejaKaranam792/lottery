import React from "react";
import { Link, BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import PickWinner from "./PickWinner";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="PickWinner">PickWinner</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="PickWinner" element={<PickWinner />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
