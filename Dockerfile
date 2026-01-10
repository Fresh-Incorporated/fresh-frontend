ARG NODE_VERSION=20.16.0

FROM node:${NODE_VERSION}-slim AS base
WORKDIR /src

FROM base AS build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM base AS runtime

ENV NODE_ENV=production
ARG PORT=3000
ENV PORT=$PORT

COPY --from=build /src/.output /src/.output

CMD ["node", ".output/server/index.mjs"]
