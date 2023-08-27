"use client"
import {useState, useEffect} from 'react'
const useMounted = ():Array<boolean | React.Dispatch<React.SetStateAction<boolean>>> => {
 const [isMounted, setIsMounted] = useState<boolean>(false);
 useEffect(()=>{
    setIsMounted(true);
 }, []);

 return [isMounted, setIsMounted];
}
export default useMounted;
