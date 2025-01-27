import {useEffect, useState} from 'react'

/** Custom hook for keeping data synced with local storage
 * 
 * It creates item as state and looks in local storage for current value
 * if not found defaults to first value
 * 
 * useEffect re-runs when item is changed
 * if new state is null it will remove from local storage
 * else it will update
 */

function useLocalStorage(key, firstValue = null){
const initialValue = localStorage.getItem(key) || firstValue

    const [item, setItem] = useState(initialValue)

    useEffect(
        function setKeyInLocalstorage(){
            if(item === null){
                localStorage.remove(key)
            } else{
                localStorage.setItem(key, item)
            }
        }, [key, item]
    )
    return [item, setItem]
}

export default useLocalStorage