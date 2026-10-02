'use client';
import {useEffect} from 'react';
export function Visit({productId}:{productId:string}){useEffect(()=>{fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId})}).catch(()=>{});},[productId]);return null;}
