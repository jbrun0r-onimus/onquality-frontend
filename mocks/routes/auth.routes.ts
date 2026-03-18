import { Response } from 'miragejs';
import { MockServer } from 'mocks/server';
import { loginSchema } from 'src/schemas/auth.schemas';

export function registerAuthRoutes(server: MockServer) {
  server.post('v1/auth/login', (schema, request) => {
    const { username, password } = loginSchema.validateSync(
      JSON.parse(request.requestBody)
    );

    const user = schema.findBy('user', { username, password });

    if (!user) {
      return new Response(
        400,
        {},
        {
          status: 400,
          timestamp: new Date().toISOString(),
          type: 'http://localhost/invalid-data',
          title: 'Invalid data',
          detail: 'Invalid username or password.',
          userMessage: 'Invalid username or password.',
        }
      );
    }

    return {
      username,
      token: `mock-token:${username}`,
    };
  });
}
