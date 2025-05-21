import { TonConnectButton } from '@tonconnect/ui-react';
import { Toaster } from 'sonner';
import { InfoAccount } from './components/info-account';
import { PaymentOrders } from './components/payment-orders';

export default function App() {
  return (
    <div className='h-full w-full p-4 flex flex-col gap-4'>
      <TonConnectButton />
      <InfoAccount />
      <PaymentOrders />
      <Toaster />
    </div>
  );
}
