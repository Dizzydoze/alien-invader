import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import bullet from "./images/bullet.png"

const Bullet = ({ x, y: initialY, onBulletHit, index}) => {
    const [y, setY] = useState(initialY);

    useEffect(() => {
        const bulletInterval = setInterval(() => {
            setY((y) => Math.max(y - 50, 0));

            // Check if the bullet hits the top of the screen
            if (y <= 0) {
                clearInterval(bulletInterval);
                // onBulletHit(index);
            }
        }, 20);

        return () => {
            clearInterval(bulletInterval);
        }
    }, []);

    const style = { left: `${x}%`, top: `${y}vh`, position: 'absolute'/*, "background-color":color */};

    // bullet start at the bottom of the screen
    return (

        <motion.div
            // initial={{ x: x, y: window.innerHeight }}
            initial={{ x: x, y: initialY }}
            animate={{ x: x, y: y }}
            transition={{ duration: 0.3 }}
            className="bullet"
        >
            <img src={bullet} style={{width:"5vh",height:"5vh"}}/>
        </motion.div>
    );
};

export default Bullet;
