import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { listen } from '@tauri-apps/api/event';
import "./css/App.css";
import "./css/reset.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  function clearTags(){
    const fileListElement = document.getElementById('file-list');
    if (fileListElement) {
      console.log('Очистка списка файлов');
      fileListElement.innerHTML = ''; //  Очищаем содержимое элемента
    }
  }

  listen('clear-tags', ()=> (
    clearTags()
  ));

  listen('file-selected', (event) => {
      const fileList = event.payload; // Получаем список файлов
      const fileListElement = document.getElementById('file-list');
      // Очищаем текущий список
      fileListElement.innerHTML = '';
      // Добавляем каждый файл в список
      fileList.forEach(file => {
          const listItem = document.createElement('li');
          listItem.textContent = file; // Добавляем имя файла в элемент списка
          fileListElement.appendChild(listItem);
      });
  });


  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      <ul id="file-list"></ul>
    </main>
  );
}

export default App;
