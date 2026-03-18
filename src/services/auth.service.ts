import { authApi as api } from 'src/services/api.service';
import {
  LoginRequest,
  LoginResponse,
  loginResponseSchema,
} from 'src/schemas/auth.schemas';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/validate_user_weight', data);
  return loginResponseSchema.validateSync(response.data);
}
