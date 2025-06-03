import { create } from 'zustand';

interface User {
  user_id: number;
  username: string;
  email: string;
  money: number;
  avatar_url?: string;
  banner_url?: string;
  border_url?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setAvatarUrl: (url: string) => void;
  setBorderUrl: (url: string) => void;
  setMoney: (money: number) => void;
  decreaseMoney: (money: number) => void;
  setBannerUrl: (url: string) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setAvatarUrl: (url) =>
    set((state) =>
      state.user ? { user: { ...state.user, avatar_url: url } } : {}
    ),
  setBorderUrl: (url) =>
    set((state) =>
      state.user ? { user: { ...state.user, border_url: url } } : {}
  ),
  setMoney: (amount: number) =>
    set((state) =>
      state.user
        ? { user: { ...state.user, money: state.user.money + amount } } : {}
  ),
  decreaseMoney: (amount: number) => 
    set((state) => 
      state.user ? { user: { ...state.user, money: state.user.money - amount}} : {}
    ),
  setBannerUrl: (url) =>
    set((state) =>
      state.user ? { user: { ...state.user, banner_url: url } } : {}
    ),
}));

export default useAuthStore;
