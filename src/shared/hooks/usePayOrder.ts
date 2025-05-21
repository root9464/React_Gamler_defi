import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';
import { validateResult } from '../utils/utils';

const PaymentOrderSchema = z.object({
  cell: z.string(),
});

type PaymentOrder = z.infer<typeof PaymentOrderSchema>;

const usePayOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['pay-order'],
    mutationFn: async (orderId: string) => {
      const { data, status, statusText } = await axios.get<PaymentOrder>('/api/referral/payment-orders/pay', {
        params: { order_id: orderId },
      });
      if (status !== 200) throw new Error(statusText);
      return validateResult(data, PaymentOrderSchema);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment-order', data.cell] });
    },
  });
};

const usePayAllOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['pay-all-orders'],
    mutationFn: async (authorId: number) => {
      const { data, status, statusText } = await axios.get<PaymentOrder>('api/referral/payment-orders/all', {
        params: { author_id: authorId },
      });
      if (status !== 200) throw new Error(statusText);
      return validateResult(data, PaymentOrderSchema);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment-order', data.cell] });
    },
  });
};

export { usePayAllOrders, usePayOrder };
export type { PaymentOrder };
