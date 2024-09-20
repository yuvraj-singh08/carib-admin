import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '@/pages/layout';

interface MaxWrapperProps {
  children: React.ReactNode;
}

export const SidebarLayoutWrapper = ({ children, ...rest }: MaxWrapperProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full bg-white !scroll-smooth overflow-x-hidden"
        {...rest}
        style={{ scrollBehavior: "smooth" }}
      >
       <Layout>{children}</Layout>
      </motion.div>
    </AnimatePresence>
  );
};
