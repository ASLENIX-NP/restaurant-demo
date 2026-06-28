import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useSocket } from '../context/SocketContext';

export function useMenuData() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  // Setup WebSocket listener for real-time invalidation
  useEffect(() => {
    if (!socket) return;

    const handleMenuUpdate = () => {
      // Invalidate the cache to trigger a silent background refetch
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    };

    socket.on("menuUpdated", handleMenuUpdate);

    return () => {
      socket.off("menuUpdated", handleMenuUpdate);
    };
  }, [queryClient, socket]);

  return useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/menu');
      return Array.isArray(data) ? data : (data?.items || []);
    },
  });
}
