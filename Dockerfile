# ============ base ============
FROM node:20-alpine AS base
WORKDIR /app

# ============ deps ============
FROM base AS deps
# Nếu dùng npm
COPY package.json package-lock.json* ./
RUN npm ci

# Nếu dùng yarn, thay bằng:
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# ============ builder ============
FROM base AS builder

# copy node_modules từ stage deps
COPY --from=deps /app/node_modules ./node_modules

# copy toàn bộ source
COPY . .

# copy file env (nếu bạn muốn tách riêng)
# Nếu file env đã nằm trong COPY . . rồi thì không cần dòng này
# COPY .env.production ./.env.production

# build Next.js
RUN npm run build

# ============ runner ============
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# tạo user non-root (best practice, không bắt buộc)
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# copy cần thiết để chạy
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# cài deps production
RUN npm ci --omit=dev

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
