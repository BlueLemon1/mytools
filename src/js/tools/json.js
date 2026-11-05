export const formatJson=(source,indent=2)=>JSON.stringify(JSON.parse(source),null,indent);
export const minifyJson=source=>JSON.stringify(JSON.parse(source));
export function validateJson(source){try{JSON.parse(source);return true}catch{return false}}