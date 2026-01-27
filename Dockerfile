# STAGE 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Run
FROM node:22-alpine AS runner
WORKDIR /app
# Sirf zaroori files copy karein (dist aur package.json)
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
# Sirf production dependencies install karein
RUN npm install --omit=dev

EXPOSE 4000
CMD ["npm", "run", "serve:ssr"]