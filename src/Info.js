import { useEffect, useState } from "react";

export default function Info({ x, y, type, result }){
    const style = { left: `${x}%`, top: `${y}vh`, position: 'absolute', color:"red" };  
    useEffect(()=>{
        console.log(x+","+y+":"+result+"@"+type);
    },[x]);
  return (
    <div className="info" style={style}>
        <p>{type}:{result}</p>    
    </div>
  );
};