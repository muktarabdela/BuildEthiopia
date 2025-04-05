// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

/**
 * Custom hook that debounces a value.
 *
 * This hook delays updating its returned value until a specified amount of time
 * has passed without the input value changing. It's commonly used to limit
 * the rate at which expensive operations (like API calls based on user input)
 * are triggered.
 *
 * @template T The type of the value being debounced.
 * @param {T} value The value to debounce. This is the frequently changing value (e.g., from an input field).
 * @param {number} delay The debounce delay in milliseconds. The returned value will update only after this duration of inactivity.
 * @returns {T} The debounced value. It will reflect the latest `value` after the `delay` has passed without `value` changing.
 *
 * @example
 * // In your component:
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce for 500ms
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform API call or other expensive operation
 *     console.log('Searching for:', debouncedSearchTerm);
 *     // fetchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]); // Effect runs only when debouncedSearchTerm changes
 *
 * // ... render input with onChange={e => setSearchTerm(e.target.value)}
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Set up a timer using setTimeout.
      // This timer will update the debouncedValue state after the specified delay.
      const timerId = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function.
      // This function will be called:
      // 1. When the component unmounts.
      // 2. Before the effect runs again if the dependencies (`value` or `delay`) change.
      // Its purpose is to cancel the previously scheduled timer if the value changes
      // within the delay period, effectively resetting the debounce timer.
      return () => {
        clearTimeout(timerId);
      };
    },
    // Dependencies array:
    // The effect will re-run only if `value` or `delay` changes.
    [value, delay]
  );

  // Return the debounced value
  return debouncedValue;
}
