import { useEffect, useState } from "react";

function useLocalStorageState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    if (value === null || value === undefined || value === "") {
      console.log(`Removing item from localStorage for key: ${key}`);
      localStorage.removeItem(key);
    } else {
      console.log(`Setting localStorage for key: ${key}, value: ${JSON.stringify(value)}`);
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  const removeItem = () => {
    setValue(null);
    localStorage.clear();
  };

  return [value, setValue];
}

export { useLocalStorageState };