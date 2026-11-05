const prefix='mytools:v2:';
export function readStorage(key,fallback){try{const value=localStorage.getItem(prefix+key);return value===null?fallback:JSON.parse(value)}catch{return fallback}}
export function writeStorage(key,value){try{localStorage.setItem(prefix+key,JSON.stringify(value));return true}catch{return false}}