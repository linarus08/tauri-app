import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./css/App.css";
import "./css/reset.css";
import useEventListeners from "./components/Listener";
import BasicTable from "./components/BasicTable";

function App() {
  const [files, setFiles] = useState({});
  useEventListeners(setFiles);
  const handleClick = async () => {
    // Формируем объект с ключом payload, который внутри содержит объект files
    const payload = { payload: { files: files } };
    try {
      await invoke("packet_processing", payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className="container">
        <div>
          <h1>Welcome to Tauri + React</h1>
          <button onClick={handleClick}>Greet</button>
        </div>
      </nav>
      <main className="container">
        <ol id="file-list"></ol>
        <BasicTable data={files} />
      </main>
    </>
  );
}

export default App;
