"use client";
import { useToastStore } from "@/store/useToastStore";
import { motion, AnimatePresence } from "framer-motion";
import ToastMessage from "@/components/molecules/toastMessage";

export default function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-3 right-3 w-screen max-w-full pointer-events-none z-50">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            >
            <ToastMessage message={toast.message} toast_id={toast.id} type={toast.type}/>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
