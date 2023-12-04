import "./css/Boss.css";
import { motion } from "framer-motion";
import ufo from "./images/gif/ufo.gif";

export default function Boss({ x }) {
  const bossStyle = {
    position: "absolute",
    left: `${x}vh`,
    mixBlendMode: "screen", // Use 'screen' blend mode to attempt transparency
  };

  return (
    <motion.div className='boss' style={bossStyle}>
      <img className='ufo' src={ufo} alt='ufo' />
    </motion.div>
  );
}