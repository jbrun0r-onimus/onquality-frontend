import { MockServer } from 'mocks/server';
import { registerAuthRoutes } from 'mocks/routes/auth.routes';

export function routes(this: MockServer) {
  registerAuthRoutes(this);
}
