import React from 'react';
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./css/App.css";
import "./css/reset.css";
import BasicTable from "./components/BasicTable";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  function clearTags() {
    const fileListElement = document.getElementById("file-list");
    if (fileListElement) {
      console.log("Очистка списка файлов");
      fileListElement.innerHTML = ""; //  Очищаем содержимое элемента
    }
  }

  listen("clear-tags", () => clearTags());

  listen("file-selected", (event) => {
    const fileList = event.payload; // Получаем список файлов
    const fileListElement = document.getElementById("file-list");
    // Очищаем текущий список
    fileListElement.innerHTML = "";
    // Добавляем каждый файл в список
    fileList.forEach((file) => {
      console.log(file);
      const listItem = document.createElement("li");
      listItem.textContent = file; // Добавляем имя файла в элемент списка
      fileListElement.appendChild(listItem);
    });
  });

  return (
    <>
      <nav className="container">
        <div>
          <h1>Welcome to Tauri + React</h1>
        </div>
      </nav>
      <main className="container">
        <ol id="file-list"></ol>
        <BasicTable>{ BasicTable }</BasicTable>
      </main>
    </>
  );
}

export default App;
