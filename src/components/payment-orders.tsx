/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQueryClient } from '@tanstack/react-query';
import { Address, Cell, toNano } from '@ton/core';
import { CHAIN, useTonAddress, useTonConnectUI, type SendTransactionRequest } from '@tonconnect/ui-react';
import type { FC } from 'react';
import { toast } from 'sonner';
import { type TokenBalance } from '../shared/hooks/useGetJettonWallet';
import { useGetPaymentOrders, type PaymentOrder } from '../shared/hooks/useGetPaymentOrders';
import { usePayAllOrders, usePayOrder } from '../shared/hooks/usePayOrder';
import { findJettonWallet } from './info-account';

type Order = {
  orders: PaymentOrder[];
  orderId: string;
  isPending: boolean;
  isSuccess: boolean;
  cell: string;
  pay: (cell: string) => void;
  createCell: (id: string) => void;
};

const OrderList: FC<Order> = ({ orders, orderId, isPending, isSuccess, cell, pay, createCell }) => (
  <div className='border-t border-gray-200 pt-2 gap-2 flex flex-col'>
    {orders?.map((order) => {
      const isProcessing = isPending && orderId === order.id;
      const isPaid = isSuccess && orderId === order.id;

      return (
        <div key={order.id} className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1 bg-gray-100 p-2 rounded-lg'>
            <p>amount debt: {order.total_amount}</p>
            <p>ticket count: {order.ticket_count}</p>
            <p>created at: {order.created_at}</p>
            {isPaid && <p className='truncate max-w-[200px]'>cell: {cell}</p>}
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
              onClick={() => pay(cell)}
              disabled={!cell}>
              {isPaid ? 'Pay' : 'Create cell'}
            </button>
          </div>
        </div>
      );
    })}
  </div>
);
const AUTHOR_ID = 3;
const successToast = (text: string, description: string) =>
  toast(text, {
    description: description,
    unstyled: true,
    position: 'top-center',
    classNames: {
      toast: 'bg-white text-gray-500 rounded-[6px] px-3 py-2 w-[300px] border border-[#F2F2F7] shadow-lg',
      title: 'text-[#231F20]',
    },
  });
export const PaymentOrders = () => {
  const { data: orders } = useGetPaymentOrders(AUTHOR_ID); // tell the backend to add an endp to det author by wallet_address
  const { mutate: createCell, variables: payingOrderId, isPending, isSuccess, data: trOrder } = usePayOrder();
  const [tonConnectUI] = useTonConnectUI();

  const address = useTonAddress();
  const queryClient = useQueryClient();
  const jettonWallet = queryClient.getQueryData<{ balances: TokenBalance[] }>(['jetton-wallet', address]);
  const jettonWalletBalance = findJettonWallet('FROGE', jettonWallet ?? { balances: [] });
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
      successToast('Transaction sent', 'transaction sent successfully');
    } catch (_error) {
      successToast('Error sending transaction', 'error pay order');
    }
  };

  const { mutateAsync: payAllOrders, isPending: isPayingAllOrders, isSuccess: isPayingAllOrdersSuccess } = usePayAllOrders();
  const payAll = async (authorId: number) => {
    if (!jettonWalletBalance || !orders) return;

    try {
      const { cell } = await payAllOrders(authorId);
      const message: SendTransactionRequest = {
        validUntil: Date.now() + 1000 * 60 * 5,
        network: CHAIN.TESTNET,
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
      successToast('Transaction sent', 'transaction sent successfully');
    } catch (error) {
      console.error('Payment error:', error);
      successToast('Error processing payment', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className='w-[230px] px-5 py-2 rounded-lg bg-white relative flex flex-col gap-2'>
      <p>Payment orders</p>
      <OrderList
        orders={orders ?? []}
        orderId={payingOrderId ?? ''}
        isPending={isPending}
        isSuccess={isSuccess}
        cell={trOrder?.cell ?? ''}
        pay={pay}
        createCell={createCell}
      />

      <button
        className='bg-blue-500 text-white px-2 py-1 rounded-lg disabled:opacity-50 w-full'
        onClick={() => payAll(AUTHOR_ID)}
        disabled={isPayingAllOrders}>
        {isPayingAllOrdersSuccess ? 'Paying all orders' : isPayingAllOrders ? 'Processing...' : 'Pay all orders'}
      </button>
    </div>
  );
};
