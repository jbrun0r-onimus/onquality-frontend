import { createServer, Server, Response } from 'miragejs';
import { Registry } from 'miragejs/-types';
import { routes } from 'mocks/routes';
import { factories } from 'mocks/factories';
import { seeds } from 'mocks/seeds';
import { models } from 'mocks/models';
import Schema from 'miragejs/orm/schema';

export type MockRegistry = Registry<typeof models, typeof factories>;
export type MockServer = Server<MockRegistry>;
export type MockSchema = Schema<MockRegistry>;

/** should be fixed in https://github.com/pretenderjs/pretender/pull/353 */
export type MockServerWithHandledRequests = MockServer & {
  pretender: MockServer['pretender'] & {
    handledRequests: {
      method: string;
      requestBody: string;
      requestHeaders: Record<string, string>;
      response: string;
      responseHeaders: Record<string, string>;
      responseText: string;
      responseURL: string;
      status: number;
      statusText: string;
      url: string;
    }[];
  };
};

export function startMockServer(
  urlPrefix: string,
  environment: 'development' | 'test' = 'development'
): MockServer {
  console.log('Mock server started!', environment);
  const server = createServer({
    environment,
    trackRequests: environment === 'test',
    urlPrefix,
    models,
    routes,
    factories,
    seeds,
  });
  return server;
}

/**
 * https://miragejs.com/quickstarts/cypress/#step-4-proxy-your-apps-network-requests
 */
export function startMockServerProxy(urlPrefix: string) {
  const methods = ['get', 'put', 'patch', 'post', 'delete'] as const;

  createServer({
    environment: 'test',
    urlPrefix,
    routes() {
      for (const method of methods) {
        this[method]('*', async (schema, request) => {
          if (!window.handleFromCypress)
            throw new Error('handleFromCypress missing from window object');
          const [status, headers, body] = await window.handleFromCypress(
            request
          );
          return new Response(
            status,
            headers as unknown as Record<string, string>,
            body
          );
        });
      }
    },
  });
}
