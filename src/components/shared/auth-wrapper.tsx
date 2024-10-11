import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface MaxWrapperProps {
  children: React.ReactNode;
}

export const MaxWrapper = ({ children, ...rest }: MaxWrapperProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full bg-white !scroll-smooth overflow-x-hidden px-20"
        {...rest}
        style={{ scrollBehavior: "smooth" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
