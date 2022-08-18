FROM node:lts-alpine AS builder

WORKDIR /build/
COPY . /build/
RUN npm install && npm run build

FROM node:lts-alpine
WORKDIR /app/
COPY --from=builder /build/package.json /build/yarn.lock /app/
COPY --from=builder /build/dist /app/dist
RUN npm install --omit=dev
EXPOSE 8080
CMD npm run serve
