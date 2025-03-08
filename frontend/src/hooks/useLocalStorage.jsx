import {useEffect, useState} from 'react'

/** Custom hook for keeping data synced with local storage
 * 
 * It creates item as state and looks in local storage for current value
 * if not found defaults to first value
 * 
 * useEffect re-runs when item is changed
 * if new state is null it will remove from local storage
 * else it will update
 * 
 * @param {string} key - The local storage key.
 * @param {any} firstValue - The default value if no value is found in local storage.
 * @returns {[any, Function]} - The stateful value and a function to update it.
 */

function useLocalStorage(key, firstValue = null){
    const storedValue = localStorage.getItem(key)
    let initialValue;

    try{
        initialValue = storedValue ? JSON.parse(storedValue) : firstValue
    }catch(err){
        console.error("Error parsing localStorage value", err)
        initialValue = firstValue
    }

    const [item, setItem] = useState(initialValue)

    useEffect(
        function setKeyInLocalstorage(){
            if(item === null){
                localStorage.removeItem(key)
            } else{
                localStorage.setItem(key, JSON.stringify(item))
            }
        }, [key, item]
    )
    return [item, setItem]
}

export default useLocalStorage