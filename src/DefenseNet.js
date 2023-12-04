import "./css/DefenseNet.css";
import LinearProgress from '@mui/material/LinearProgress';

export default function DefenseNet({ y }) {
  const style = { top: `${y+5}vh`, position: "absolute" };

  return <div className="defense-net" style={style}><LinearProgress color="success" /></div>;  
}
