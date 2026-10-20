import { useEffect, useState } from "react";

// Как useState, только значение хранится в localStorage и переживает обновление страницы.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* localStorage недоступен — просто работаем без сохранения */
    }
  }, [key, value]);

  return [value, setValue];
}
