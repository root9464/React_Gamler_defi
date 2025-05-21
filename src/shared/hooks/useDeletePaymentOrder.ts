/* eslint-disable no-case-declarations */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type DeletePaymentOrderResponse = {
  message: string;
};

type DeleteType = 'all' | 'single';

export const useDeletePaymentOrder = (deleteType: DeleteType, orderId?: string) =>
  useQuery({
    queryKey: ['delete-payment-order', deleteType, orderId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      switch (deleteType) {
        case 'all':
          const { data, status, statusText } = await axios.delete<DeletePaymentOrderResponse>(`/api/referral/payment-orders/all`);
          if (status !== 200) throw new Error(statusText);
          return data;
        case 'single': {
          if (!orderId) throw new Error('Order ID is required');
          const { data, status, statusText } = await axios.delete<DeletePaymentOrderResponse>(`/api/referral/payment-orders/${orderId}`);
          if (status !== 200) throw new Error(statusText);
          return data;
        }
        default:
          throw new Error('Invalid delete type');
      }
    },
    enabled: !!orderId,
  });
