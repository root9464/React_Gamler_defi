import { useQuery } from '@tanstack/react-query';
import { tonApiInstance } from '../lib/tonapi';

type Address = {
  address: string;
  is_scam: boolean;
  is_wallet: boolean;
};

type Jetton = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  image: string;
  verification: string;
  score: number;
};

export type TokenBalance = {
  balance: string;
  wallet_address: Address;
  jetton: Jetton;
};

export const useGetJettonWallet = ({ address }: { address: string }) =>
  useQuery({
    queryKey: ['jetton-wallet', address],
    queryFn: async () => {
      const jettons = await tonApiInstance.get<{ balances: TokenBalance[] }>(`/accounts/${address}/jettons`);
      return jettons.data;
    },
    enabled: !!address,
  });
