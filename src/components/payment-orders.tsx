/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQueryClient } from '@tanstack/react-query';
import { Address, Cell, toNano } from '@ton/core';
import { CHAIN, useTonAddress, useTonConnectUI, type SendTransactionRequest } from '@tonconnect/ui-react';
import { toast } from 'sonner';
import { type TokenBalance } from '../shared/hooks/useGetJettonWallet';
import { useGetPaymentOrders } from '../shared/hooks/useGetPaymentOrders';
import { usePayOrder } from '../shared/hooks/usePayOrder';
import { findJettonWallet } from './info-account';

export const PaymentOrders = () => {
  const { data: orders } = useGetPaymentOrders(3); // tell the backend to add an endp to det author by wallet_address
  const { mutate: createCell, variables: payingOrderId, isPending, isSuccess, data: trOrder } = usePayOrder();
  const [tonConnectUI] = useTonConnectUI();

  const address = useTonAddress();
  const queryClient = useQueryClient();
  const jettonWallet = queryClient.getQueryData<{ balances: TokenBalance[] }>(['jetton-wallet', address]);
  const jettonWalletBalance = findJettonWallet('FROGE', jettonWallet ?? { balances: [] });
  console.log(jettonWalletBalance);
  const pay = async (cell: string) => {
    if (!jettonWalletBalance) return;
    try {
      const message: SendTransactionRequest = {
        validUntil: Date.now() + 1000 * 60 * 5,
        network: CHAIN.TESTNET, // change to mainet in prod version
        messages: [
          {
            address: Address.parse(jettonWalletBalance.wallet_address.address).toString(),
            amount: toNano(0.4).toString(),
            payload: cell,
          },
        ],
      };
      const { boc } = await tonConnectUI.sendTransaction(message);
      const trHash = Cell.fromBase64(boc).hash().toString('hex');
      console.log(trHash);
      toast('Transaction sent', {
        description: 'transaction sent successfully',
        unstyled: true,
        position: 'top-center',
        classNames: {
          toast: 'bg-white text-gray-500 rounded-[6px] px-3 py-2 w-[300px] border border-[#F2F2F7] shadow-lg',
          title: 'text-[#231F20]',
        },
      });
    } catch (_error) {
      toast('Error sending transaction', {
        description: 'error pay order',
        unstyled: true,
        position: 'top-center',
        classNames: {
          toast: 'bg-white text-gray-500 rounded-[6px] px-3 py-2 w-[300px] border border-[#F2F2F7] shadow-lg',
          title: 'text-[#231F20]',
        },
      });
    }
  };
  return (
    <div className='w-[230px] px-5 py-2 rounded-lg bg-white relative'>
      <p>Payment orders</p>
      <div className='border-t border-gray-200 pt-2 gap-2 flex flex-col'>
        {orders?.map((order) => {
          const isProcessing = isPending && payingOrderId === order.id;
          const isPaid = isSuccess && payingOrderId === order.id;

          return (
            <div key={order.id} className='flex flex-col gap-2'>
              <div className='flex flex-col gap-1 bg-gray-100 p-2 rounded-lg'>
                <p>amount debt: {order.total_amount}</p>
                <p>ticket count: {order.ticket_count}</p>
                <p>created at: {order.created_at}</p>
                {isPaid && <p className='truncate max-w-[200px]'>cell: {trOrder?.cell}</p>}
              </div>

              <div className='flex gap-2 flex-row justify-stretch w-full h-fit'>
                <button
                  className='bg-blue-500 text-white px-2 py-1 rounded-lg disabled:opacity-50 flex-1'
                  onClick={() => createCell(order.id)}
                  disabled={isPaid}>
                  {isProcessing ? 'Creating...' : isPaid ? 'Paid' : 'Get cell'}
                </button>
                <button
                  className='bg-blue-500 text-white px-2 py-1 rounded-lg disabled:opacity-50 flex-1'
                  onClick={() => pay(trOrder?.cell ?? '')}
                  disabled={!trOrder?.cell}>
                  {isPaid ? 'Pay' : 'Create cell'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
