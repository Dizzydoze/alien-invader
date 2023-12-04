import "./css/Shooter.css";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Bullet from "./Bullets";
import barbette from "./images/barbette.png";

function Shooter({ score, time }) {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [shooterWidth, setShooterWidth] = useState(0);
  const containerRef = useRef(null);
  const shooterRef = useRef(null);
  const step = 50; // Adjust the step value as needed
  const [bullets, setBullets] = useState([]);

   // max number of bullets
   const maxBullets = 10;

  function handleKeyDown(event) {
    const key = event.keyCode;
    const containerWidth = containerRef.current.clientWidth;
    if (key === 65) {
      setX((x) => Math.max(x - step, 0));
    } else if (key === 68) {
      setX((x) => Math.min(x + step, containerWidth - shooterWidth)); // Adjust the subtracted value as needed
    } else if (key === 74) {
      // space bar pressed
      if (bullets.length >= maxBullets) {
        setBullets((prevBullets) => {
          const remainingBullets = prevBullets.slice(1); // remove the first bullet
          const newBullet = { x, y }; // pass x y to new bullet
          return [...remainingBullets, newBullet]; // add the new bullet into bullet list
        });
      } else {
        const yUpdate = y - 50;
        setBullets((prevBullets) => [...prevBullets, { x , yUpdate }]);
      }
    }
  }

  // After a bullet hits a target
  const handleBulletHit = (index) => {
    // Remove the bullet at index from the bullets array when it hits the top
    setBullets((prevBullets) => prevBullets.filter((_, i) => i !== index));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shooterWidth]);

  useEffect(() => {
    setShooterWidth(shooterRef.current.getBoundingClientRect().width);

  }, [x]);

  return (
    <div className="shooter-container" ref={containerRef}>
      <motion.div
        initial={{ x: x }}
        animate={{ x: x }}
        transition={{ duration: 0.2 }}
        className="shooter"
        ref={shooterRef}
      >
        <img className='barbette' src={barbette} alt='barbette'/>
        <div>{score}</div>
        <div>{time / 1000}</div>
      </motion.div>
       {/* Render Bullets */}
       {bullets.map((bullet, index) => (
                <Bullet
                    key={index}
                    x={bullet.x}
                    y={bullet.y}
                    // onBulletHit={() => handleBulletHit(index)}
                    index={index}
                />
        ))}
    </div>
  );
}

export default Shooter;
