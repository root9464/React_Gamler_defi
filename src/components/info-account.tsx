/* eslint-disable react-refresh/only-export-components */
import { Address } from '@ton/core';
import { useTonAddress } from '@tonconnect/ui-react';
import { useGetJettonWallet, type TokenBalance } from '../shared/hooks/useGetJettonWallet';
import { usePing } from '../shared/hooks/usePing';

export const findJettonWallet = (symbol: string, jettonWallet: { balances: TokenBalance[] }): TokenBalance | undefined => {
  return jettonWallet.balances.find((balance) => balance.jetton.symbol === symbol);
};

export const InfoAccount = () => {
  const address = useTonAddress();
  const { data: jettonWallet } = useGetJettonWallet({ address });
  const jettonWalletBalance = findJettonWallet('FROGE', jettonWallet ?? { balances: [] });
  const { data } = usePing();
  return (
    <div className='w-fit px-5 py-2 rounded-lg bg-white relative'>
      <div className={`w-2 h-2 rounded-full absolute top-1 left-1 ${data ? 'bg-green-500' : 'bg-red-500'}`} />
      <p>Ton wallet: {address}</p>
      <p>Jettons wallet: {jettonWalletBalance ? Address.parse(jettonWalletBalance.wallet_address.address).toString() : '0'}</p>
      <p>FROGE BALANCE: {jettonWalletBalance ? Number(jettonWalletBalance.balance) / 10 ** jettonWalletBalance.jetton.decimals : '0'}</p>
    </div>
  );
};
