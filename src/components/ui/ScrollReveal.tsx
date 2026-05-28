import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  distance?: number; // offset distance
  className?: string;
  stagger?: boolean;
}

/**
 * Reusable component to animate elements on scroll into viewport.
 * Uses framer-motion with premium, modern cubic-bezier easing.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 800,
  distance = 30,
  className = '',
  stagger = false,
}) => {
  const delaySec = delay / 1000;
  const durationSec = duration / 1000;

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: durationSec,
        delay: delaySec,
        ease: [0.16, 1, 0.3, 1], // Elegant premium bezier
      },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delaySec,
      },
    },
  };

  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollRevealChildProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  duration?: number;
}

/**
 * Child element to be nested inside a `<ScrollReveal stagger={true}>` container.
 * Inherits parent activation automatically, applying its own visual direction.
 */
export const ScrollRevealChild: React.FC<ScrollRevealChildProps> = ({
  children,
  direction = 'up',
  distance = 30,
  className = '',
  duration = 800,
}) => {
  const durationSec = duration / 1000;
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: durationSec,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
};
