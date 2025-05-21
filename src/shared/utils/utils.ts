import { z } from 'zod/v4';

export const validateResult = <T extends z.ZodType, R>(data: R, resType: T): z.infer<T> => {
  try {
    return resType.parse(data);
  } catch (error) {
    console.error('Validation error:', (error as z.ZodError).toString());
    throw error;
  }
};
