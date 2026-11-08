import { useEffect, useState } from "react";

function readValue(key, initialValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? initialValue : JSON.parse(raw);
  } catch {
    // missing storage or corrupted JSON -> fall back
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable: ignore
    }
  }, [key, value]);

  return [value, setValue];
}
