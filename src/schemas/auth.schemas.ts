import { object, string, number, InferType } from 'yup';

export const loginSchema = object({
  user: string().required(),
  password: string().required(),
});
export type LoginRequest = InferType<typeof loginSchema>;

export const loginResponseSchema = object({
  empresa_id: number().required(),
  message: string().required(),
  empresa: string().required()
});

export type LoginResponse = InferType<typeof loginResponseSchema>;
