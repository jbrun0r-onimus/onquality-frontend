import { MockServer } from 'mocks/server';

export function seeds(server: MockServer) {
  server.create('user', {
    name: 'Onimus Admin',
    username: 'admin',
    password: '12345678',
  });
  server.createList('user', 29);
}
