import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bannerUrl?: string;
  trustScore: number;
  trustLevel: 'Newbie' | 'Verified' | 'Trusted' | 'Elite';
  completionRate: number;
  credits: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  bio?: string;
}

interface UserState {
  user: User | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: '1',
    name: 'Alex Developer',
    email: 'alex@skillswap.local',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    trustScore: 85,
    trustLevel: 'Trusted',
    completionRate: 92,
    credits: 12.5,
  },
  theme: 'dark',
  sidebarOpen: true,
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({ 
    user: state.user ? { ...state.user, ...updates } : null 
  })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
