import { useEffect, useState } from "react";

function useLocalStorageState(defaultValue, key){
    const [value, setValue] = useState(()=>{
        const localStorageValue = localStorage.getItem(key);
        console.log(`local storage key ${key} value is: ${localStorageValue}`);
        return localStorageValue != null ? JSON.parse(localStorageValue) : defaultValue;
    })

    useEffect(()=>{
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`local key ${key} value is: ${value}`);
    }, [key, value]);

    return [value, setValue];
}

export {useLocalStorageState};