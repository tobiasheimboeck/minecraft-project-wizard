# Minecraft Plugin Wizard – Build & run in Docker (Next.js standalone)
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files from web
COPY web/package.json web/package-lock.json* ./
RUN npm ci

# Copy full repo (needed for template/ and generate-templates)
COPY . .

WORKDIR /app/web
RUN npm run build

# Stage 2: Run standalone Next.js server
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
