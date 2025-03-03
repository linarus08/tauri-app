import React, { useState, useRef } from "react";
import Spinner from "./components/Spinner";
import BasicTable from "./components/BasicTable";
import useEventListeners from "./components/Listener";
import { invoke } from "@tauri-apps/api/core";
import "./css/App.css";
import "./css/reset.css";

function App() {
  const [files, setFiles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // Используем ref для хранения флага отмены
  const cancelRef = useRef(false);
  useEventListeners(setFiles);
  const resetBackground = () => {
    const listRow = document.querySelectorAll(".row");
    listRow.forEach((row) => {
      row.style.backgroundColor = ""; // Сбрасываем до значения по умолчанию (из CSS)
    });
  };
  const handleTest = async () => {
    // Сброс флага отмены перед началом обработки
    cancelRef.current = false;
    // Сначала сбрасываем фон
    resetBackground();
    // Перед началом цикла показываем спиннер
    setIsLoading(true);
    const listFileNames = document.querySelectorAll(".fl-nm");
    const listRow = document.querySelectorAll(".row");
    // Даем браузеру время на обновление состояния isLoading
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Запускаем асинхронный цикл
    for (let i = 0; i < listFileNames.length; i++) {
      // Если установлен флаг отмены, выходим из цикла
      if (cancelRef.current) {
        resetBackground();
        console.log("Операция отменена!");
        break;
      }
      try {
        const response = await invoke("packet_processing", {
          zipPath: listFileNames[i].textContent,
        });
        listRow[i].style.backgroundColor = "#4CAF50";
        console.log("Файл в Rust обработан: ", response);
      } catch (error) {
        console.log("Ошибка: ", error);
      }
    }
    // После завершения цикла скрываем спиннер
    setIsLoading(false);
  };
  // Функция для остановки обработки
  const handleStop = () => {
    cancelRef.current = true;
    resetBackground();
  };
  return (
    <>
      <nav className="container">
        <div className="nav-menu">
          <button id="btn-test" onClick={handleTest}>
            Тест
          </button>
          <button id="btn-stop" onClick={handleStop}>
            Стоп
          </button>
        </div>
      </nav>
      <main className="container">
        <ol id="file-list"></ol>
        <BasicTable data={files} />
        {isLoading && (
          <div className="spinner-container">
            <Spinner />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
