
import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T, // The raw initial value if nothing in storage or error during parse
  initializer?: (value: T) => T // Optional function to process the value (either from storage or initialValue)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    let valueToStore: T;
    try {
      const item = window.localStorage.getItem(key);
      // Use initialValue if no item is found or if parsing fails.
      // If item is found, try to parse it.
      valueToStore = item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading or parsing from localStorage", error);
      valueToStore = initialValue;
    }
    // Apply initializer if provided, otherwise use the value as is.
    return initializer ? initializer(valueToStore) : valueToStore;
  });

  useEffect(() => {
    try {
      // We assume storedValue is already in the desired final state for persistence.
      // If the initializer transforms the value into a state that shouldn't be persisted directly,
      // a separate "serializer" function would be needed before setItem.
      // For the current `initializeTasks`, the output is suitable for persistence.
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
