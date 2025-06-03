import { create } from 'zustand';

interface SocketStore {
  isConnected: boolean;
  groupId: string | null;
  playerId: string | null;
  connectToGroup: (playerId: string, groupId: string) => void;
  disconnect: () => void;
  messages: any[];
}

export const useSocketStore = create<SocketStore>((set) => {
  let socket: WebSocket | null = null;

  const connectToGroup = (playerId: string, groupId: string) => {
    if (socket) {
      socket.close();
      socket = null;
    }

    socket = new WebSocket(`ws://localhost:8003/ws/${groupId}/${playerId}`);

    socket.onopen = () => {
      console.log('Socket connected');
      set({ isConnected: true, groupId, playerId });
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('New message in group:', data);

        set((state) => ({ messages: [...(state.messages || []), data] }));
      } catch (e) {
        console.error('Error parsing message', e);
      }
    };

    socket.onclose = () => {
      console.log('Socket disconnected');
      set({ isConnected: false, groupId: null, playerId: null });
    };

    socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
    set({ isConnected: false, groupId: null, playerId: null });
  };

  return {
    isConnected: false,
    groupId: null,
    playerId: null,
    messages: [],

    connectToGroup,
    disconnect,
  };
});
