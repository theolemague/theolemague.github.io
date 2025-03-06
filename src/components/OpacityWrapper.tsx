import { motion } from "framer-motion";
import { ReactNode } from "react";

interface OpacityWrapperProps {
  children: ReactNode;
}

const OpacityWrapper = ({ children }: OpacityWrapperProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 1.5 }}>
      {children}
    </motion.div>
  );
};

export default OpacityWrapper;
