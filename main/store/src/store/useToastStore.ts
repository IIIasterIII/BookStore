import { create } from "zustand";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "alert";
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "info") => {
    const id = Date.now();
    
    set((state) => {
      const newToasts = state.toasts.length >= 3 
        ? [...state.toasts.slice(1), { id, message, type }]
        : [...state.toasts, { id, message, type }];
      
      return { toasts: newToasts };
    });

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id),
  })),
}));
