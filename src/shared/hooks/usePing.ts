import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type PingResponse = {
  message: string;
};

export const usePing = () =>
  useQuery({
    queryKey: ['ping'],
    queryFn: async () => {
      const { data } = await axios.get<PingResponse>('/api/ping');
      return data;
    },
    staleTime: 0,
    refetchInterval: 0,
  });
