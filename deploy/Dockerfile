# Minecraft Plugin Wizard – Build & run in Docker (Next.js standalone)
# Struktur wie NEXALIT: App im Root, damit server.js in .next/standalone/ landet (nicht in .next/standalone/web/)

# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY web/package.json web/package-lock.json* ./
RUN npm ci

# Stage 2: Build (App im Root wie NEXALIT – vermeidet verschachteltes server.js in Monorepo-Setup)
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web/ ./
# template/ für generate-templates (erwartet ../../template von scripts/)
COPY template/ /template/

RUN npm run build

# Stage 3: Run standalone Next.js server
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Standalone ist jetzt bei /app/.next/standalone (nicht /app/web/.next/standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
