FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/config/tsconfig.base.json packages/config/tsconfig.base.json
RUN npm ci --workspace @gkh/api --include-workspace-root

FROM deps AS build
COPY apps/api apps/api
RUN npm --workspace @gkh/api run prisma -- generate
RUN npm --workspace @gkh/api run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/api/prisma apps/api/prisma
COPY --from=build /app/apps/api/package.json apps/api/package.json
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/src/main.js"]
