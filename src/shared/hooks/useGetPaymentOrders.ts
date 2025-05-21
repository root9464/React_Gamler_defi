import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';
import { validateResult } from '../utils/utils';

const LevelSchema = z.object({
  level_number: z.number(),
  rate: z.float64(),
  amount: z.float64(),
  address: z.string(),
});

const PaymentOrderSchema = z.object({
  id: z.string(),
  author_id: z.number(),
  referrer_id: z.number(),
  referral_id: z.number(),
  total_amount: z.float64(),
  ticket_count: z.number(),
  levels: z.array(LevelSchema),
  created_at: z.number(),
});

type PaymentOrder = z.infer<typeof PaymentOrderSchema>;
type Level = z.infer<typeof LevelSchema>;

const useGetPaymentOrders = (authorId: number) =>
  useQuery({
    queryKey: ['payment-orders', authorId],
    queryFn: async () => {
      const { data, status, statusText } = await axios.get<PaymentOrder[]>(`/api/referral/${authorId}/payment-orders`);
      if (status !== 200) throw new Error(statusText);
      const paymentOrders = validateResult(data, z.array(PaymentOrderSchema));
      return paymentOrders;
    },
    enabled: !!authorId,
  });

export { useGetPaymentOrders };
export type { Level, PaymentOrder };
