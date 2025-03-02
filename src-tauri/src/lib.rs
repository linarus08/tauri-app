use tauri::menu::{MenuBuilder, SubmenuBuilder};
use tauri::Emitter;
use tauri_plugin_dialog::DialogExt;

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let text_menu = SubmenuBuilder::new(app, "File")
                .text("openfolder", "Open Folder...")
                .text("openfile", "Open File...")
                .text("clear", "Clear")
                .text("close", "Close")
                .build()?;
            let menu = MenuBuilder::new(app).items(&[&text_menu]).build()?;
            app.set_menu(menu)?;
            app.on_menu_event(move |app_handle: &tauri::AppHandle, event| {
                match event.id().0.as_str() {
                    "openfolder" => {
                        let folder_path = app_handle.dialog().file().blocking_pick_folder();
                        match folder_path {
                            Some(path) => {
                                println!("openfolder event: {}", path.to_string());
                            }
                            None => println!("openfolder event: No folder selected"),
                        }
                    }
                    "openfile" => {
                        let file_paths = app_handle
                            .dialog()
                            .file()
                            .add_filter("ZIP Files", &["zip"])
                            .blocking_pick_files();
                        match file_paths {
                            Some(paths) => {
                                for path in &paths {
                                    println!("openfile event: {:?}", path.to_string());
                                }
                                // Создаем список файлов
                                let file_list: Vec<String> =
                                    paths.iter().map(|p| p.to_string()).collect(); // Изменено на String с большой буквы
                                                                                   // Клонируем app_handle для использования в асинхронной задаче
                                let app_handle_clone = app_handle.clone();
                                // Отправьте список файлов в JavaScript
                                tauri::async_runtime::spawn(async move {
                                    app_handle_clone.emit("file-selected", file_list).unwrap();
                                });
                            }
                            None => println!("openfile event: No file selected"),
                        }
                    }
                    "clear" => {
                        println!("clear event");
                        // отправляем событие во фронтенд
                        let app_handle_clone = app_handle.clone();
                        tauri::async_runtime::spawn(async move {
                            app_handle_clone.emit("clear-tags", ()).unwrap();
                        });
                    }
                    "close" => {
                        println!("close event");
                    }
                    _ => {
                        println!("unexpected menu event");
                    }
                }
            });
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![commands::packet_processing])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
