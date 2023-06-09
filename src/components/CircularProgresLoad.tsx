import React from 'react';
import { motion, useAnimation } from 'framer-motion';

const CircularProgressLoad = ({ progress, color, circleFill = 'black', radius = 20 }) => {
  const dasharray = progress * 125;
  const controls = useAnimation();
  controls.start({
    strokeDasharray: `${dasharray}, 20000`,
  });

  return (
    <motion.svg
      style={{
        height: '50px',
        width: '50px',
        transform: 'rotate(-90deg)',
        marginTop: '3px',
      }}
    >
      <motion.circle
        transition={{ duration: 1 }}
        cx={25}
        cy="25"
        r={radius}
        fill={circleFill}
        stroke={color}
        strokeWidth="5"
        animate={controls}
        strokeDasharray="0, 20000"
      />
      {progress < 1 && color !== '#ff2424' && (
        <motion.circle
          cx={25}
          cy="25"
          r="17"
          animate={{ rotate: '360deg' }}
          transition={{ duration: 1, loop: Infinity }}
          stroke="white"
          strokeWidth="1"
          strokeDasharray="30, 20000"
        />
      )}
    </motion.svg>
  );
};

export default CircularProgressLoad;
