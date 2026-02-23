import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        return storage.get(key, initialValue);
    });

    const setValue = (value) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storage.set(key, valueToStore);
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'activityhub_' + key) {
                setStoredValue(storage.get(key, initialValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, initialValue]);

    return [storedValue, setValue];
};
