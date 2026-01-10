ARG NODE_VERSION=20.16.0

FROM node:${NODE_VERSION}-slim AS base
WORKDIR /src

FROM base AS build

COPY package.json package-lock.json ./
RUN npm ci --include=optional

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /src

ENV NODE_ENV=production
ARG PORT=3000
ENV PORT=$PORT

COPY --from=build /src/.output /src/.output

CMD ["node", ".output/server/index.mjs"]
