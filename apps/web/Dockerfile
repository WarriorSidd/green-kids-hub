FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/config/tsconfig.base.json packages/config/tsconfig.base.json
RUN npm ci --workspace @gkh/web --include-workspace-root

FROM deps AS build
COPY apps/web apps/web
RUN npm --workspace @gkh/web run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static apps/web/.next/static
COPY --from=build /app/apps/web/public apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
