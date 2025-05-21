import axios from 'axios';

export const tonApiInstance = axios.create({
  baseURL: 'https://testnet.tonapi.io/v2',
});
