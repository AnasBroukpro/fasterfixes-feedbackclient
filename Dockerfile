FROM node:20-alpine AS builder
RUN npm install -g pnpm@10.4.1
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate --schema=packages/database/schema/schema.prisma
RUN pnpm turbo run build --filter=@fasterfixes/core --filter=@fasterfixes/react
ENV DOCKER_BUILD=1
ENV R2_ACCOUNT_ID=placeholder R2_ACCESS_KEY_ID=placeholder R2_SECRET_ACCESS_KEY=placeholder
ENV GITHUB_APP_ID=placeholder GITHUB_PRIVATE_KEY=placeholder
ENV BASE_URL=http://localhost:3000 BETTER_AUTH_URL=http://localhost:3000
ENV STORAGE_BUCKET_NAME=placeholder
ENV LINEAR_TOKEN_ENCRYPTION_KEY=78268a883eb9988c7742dd0b87570b4fb26e5068e356c25a92b4913e33ba9aa1
ENV SLACK_TOKEN_ENCRYPTION_KEY=78268a883eb9988c7742dd0b87570b4fb26e5068e356c25a92b4913e33ba9aa1
ENV RESEND_API_KEY=re_placeholder
ENV BETTER_AUTH_SECRET=bf1c81205b86628c0b2a285e8f236808177f88d1c215ac50e19b9dea9b03abb8
ENV STRIPE_WEBHOOK_SIGNING_SECRET=whsec_placeholder
RUN cd apps/web && pnpm next build

FROM node:20-alpine AS runner
RUN npm install -g pnpm@10.4.1
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl ca-certificates

COPY --from=builder /app/packages/database/package.json ./packages/database/
COPY --from=builder /app/packages/database/prisma.config.ts ./packages/database/prisma.config.ts
COPY --from=builder /app/packages/database/schema ./packages/database/schema
COPY --from=builder /app/packages/database/migrations ./packages/database/migrations

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Install Prisma CLI locally in database package so prisma/config resolves
RUN cd /app/packages/database && npm install prisma@7.2.0
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "apps/web/server.js"]
