// import { Cell } from '@ton/core';
// import { Buffer } from 'buffer';

import { Cell } from '@ton/core';

const txBocB64 =
  'te6ccgECBgEAARgAAUWIABtkZd5y+xgiMqfFGV+zaR4irnst06R5FnLWsh9sIS+SDAEBnFOdZY0Lz0RvmeEyVrTel0LsK615JwFpV/oxafTYX3Bq/hPtXz0F8EsKuS/c3eFCmyOcQ0wiiRJcSWfNpgP6wwgpqaMXaCpbfAAABOsAAwIBaEIAVGhJhcRER6yyvQcUFhYimoUiH/bJ3oYBjfAyB9eDFC+gvrwgAAAAAAAAAAAAAAAAAAEDAW8Pin6lAAAAAGgqW0BSLsslwAgBr+Ua8wjjxogJucLK1eCtKIuyxoG+tsejWvPetgymwYwQF9eEAwQBAcAFAFGhcAL2+b/8M4Hvj4eQ32nF8wMwthPhiUM9iPnh1n3Kq+yBdUi7LJcAIA==';
const cell = Cell.fromBase64(txBocB64);
const txHash = cell.hash().toString('hex');

// const parsedCell = Cell.fromBase64(txBodyHashB64);

// const slice = parsedCell.beginParse();
// const op = slice.loadUint(32);
// const queryId = slice.loadUintBig(64);

// console.log('Body Hash:', Buffer.from(txBodyHashB64, 'base64').toString('hex'));
console.log('Transaction Hash:', txHash);
// console.log('Op-code:', '0x' + op.toString(16));
// console.log('Query ID:', queryId);
