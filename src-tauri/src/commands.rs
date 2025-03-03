use serde::{Serialize, Deserialize};
// use tauri::utils::pattern;
use std::collections::HashMap;
// use std::f32::consts::E;
// use std::fs;
use regex::Regex;
use std::boxed::Box;
use std::fs::File;
use std::io::{self, Read};
use tauri::command;
use zip::read::ZipArchive;


fn get_text(archive: &mut ZipArchive<File>, file: &str) -> io::Result<(String, u32)> {
    // Получаем доступ к файлу внутри архива по его имени.
    let mut file_in_zip = archive.by_name(file)?;
    // Читаем содержимое файла в строку
    let mut text_content = String::new();
    file_in_zip.read_to_string(&mut text_content)?;
    // Получаем физический (сжатый) размер файла.
    let uncompressed_size = file_in_zip.size().try_into().unwrap();
    Ok((text_content, uncompressed_size))
}

fn checker(mut archive: ZipArchive<File>, files: Vec<String>) {
    let pattern_snils = Regex::new(r"(\d{3}-\d{3}-\d{3} \d{2})").unwrap();
    let pattern_fio = Regex::new(r#"(<span class="style_2" style=" direction: ltr;">((?:&#x(?:41[0-9a-f]|42[0-9a-f]|401);-*\.*\s*)+)</span>)"#
    ).unwrap();
    for file in files {
        match get_text(&mut archive, &file) {
            Ok((text, phys_size)) => {
                let snils = pattern_snils.find(&text);
                let fio = pattern_fio.find(&text);
                if let Some(match_snils) = snils {
                    // println!("Найден СНИЛС: {}", match_snils.as_str());
                } else {
                    println!("СНИЛС не найден");
                }
                if let Some(match_fio) = fio {
                    // println!("Найдено ФИО: {}", match_fio.as_str());
                } else {
                    println!(
                        "ФИО не найдено в файле: {}. Размер файла: {} байт",
                        file, phys_size
                    );
                }
            }
            Err(e) => {
                eprintln!("Ошибка при чтении файла {}: {}", file, e);
            }
        }
    }
}

// Функция для получения списка файлов из ZIP-архива
fn get_file_list(
    zip_path: &str,
) -> Result<(ZipArchive<File>, Vec<String>), Box<dyn std::error::Error>> {
    let file = File::open(zip_path)?;
    let mut archive = ZipArchive::new(file)?;
    let mut filenames = Vec::new();
    for i in 0..archive.len() {
        let file_in_zip = archive.by_index(i)?;
        let file_name = file_in_zip.name().to_string();
        if file_name.ends_with(".html") {
            filenames.push(file_in_zip.name().to_string());
        }
    }
    Ok((archive, filenames))
}

#[tauri::command]
pub fn packet_processing(zip_path: String) -> String {
    let (archive, files) = match get_file_list(&zip_path) {
        Ok(result) => result,
        Err(e) => return format!("Ошибка при обработке файла {}: {}", zip_path, e),
    };
    checker(archive, files);
    format!("Файл {} обработан, статус: .", zip_path)
}
