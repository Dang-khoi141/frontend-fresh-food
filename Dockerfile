FROM refinedev/node:18 AS base


WORKDIR /app/refine


# ================= deps =================
FROM base AS deps

RUN apk add --no-cache libc6-compat


COPY package.json package-lock.json* .npmrc* ./

RUN npm ci


# ================= builder =================
FROM base AS builder

WORKDIR /app/refine

COPY --from=deps /app/refine/node_modules ./node_modules
COPY . .

RUN npm run build


# ================= runner =================
FROM base AS runner

WORKDIR /app/refine

ENV NODE_ENV=production

COPY --from=builder /app/refine/public ./public

RUN mkdir .next && chown refine:nodejs .next

COPY --from=builder --chown=refine:nodejs /app/refine/.next/standalone ./
COPY --from=builder --chown=refine:nodejs /app/refine/.next/static ./.next/static

USER refine

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
