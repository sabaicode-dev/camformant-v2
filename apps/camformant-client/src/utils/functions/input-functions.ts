export const addEntry=(setEntries:([])=>void,values:any,defaultValue:any)=>{
  setEntries([
    ...values,
    defaultValue
  ]);
}
export const deleteEntry=(setEntries:([])=>void,values:any)=>{
  setEntries(
    values.slice(0,values.length-1)
  );
}
export const handleInputChange=(setEntries:([])=>void,values:any,index:number,name:string,value:string)=>{
  const newEntries = [...values];
  newEntries[index][name] = value;
  setEntries(newEntries);
}