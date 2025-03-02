import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";

const useEventListeners = (setFiles) => {
  useEffect(() => {
    const clearTags = () => {
      let objFiles = {};
      const table = document.getElementsByTagName("table")[0]; // Получаем таблицу
      table.style.display = "none"; // Скрываем таблицу
      setFiles(objFiles);
    };
    const fileSelectedListener = (event) => {
      const fileList = event.payload; // Получаем список файлов
      let objFiles = {};
      fileList.forEach((file, index) => {
        objFiles[index + 1] = file;
      });
      const table = document.getElementsByTagName("table")[0]; // Получаем таблицу
      table.style.display = "block"; // Показываем таблицу
      setFiles(objFiles);
    };
    // Устанавливаем слушатели
    const clearTagsUnsubscribe = listen("clear-tags", clearTags);
    const fileSelectedUnsubscribe = listen("file-selected", fileSelectedListener);
    // Очистка слушателей при размонтировании компонента
    return () => {
      clearTagsUnsubscribe.then((unsub) => unsub());
      fileSelectedUnsubscribe.then((unsub) => unsub());
    };
  }, [setFiles]);
};
export default useEventListeners;