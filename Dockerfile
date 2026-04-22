FROM node:20-alpine as dependencies
WORKDIR /app

ENV YARN_IGNORE_ENGINES=1

# Instalar Quasar CLI globalmente
RUN yarn global add @quasar/cli

# Configurar yarn para timeout maior e retry
RUN yarn config set network-timeout 300000
RUN yarn config set registry https://registry.yarnpkg.com

COPY package.json ./
COPY yarn.lock ./

RUN yarn --ignore-engines

# Install com retry em caso de falha
RUN yarn install --frozen-lockfile --ignore-engines --network-timeout 300000 || \
    yarn install --frozen-lockfile --ignore-engines --network-timeout 300000 || \
    yarn install --frozen-lockfile --ignore-engines --network-timeout 600000

COPY . .

FROM dependencies as build
ARG VITE_API_BASE_URL
ARG VITE_AUTH_API_BASE_URL
ARG VITE_USE_MOCK_SERVER
ARG NODE_ENV=development

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_AUTH_API_BASE_URL=${VITE_AUTH_API_BASE_URL}
ENV VITE_USE_MOCK_SERVER=${VITE_USE_MOCK_SERVER}
ENV NODE_ENV=${NODE_ENV}

RUN yarn build

FROM nginx:stable-alpine as runtime
COPY --from=build /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
