FROM public.ecr.aws/s9f1h1p1/node:14-dev as builder
WORKDIR /app
COPY package.json yarn*.lock /app/
RUN yarn --pure-lockfile

# Runtime image from here
FROM public.ecr.aws/s9f1h1p1/node:14-dev

WORKDIR /app

COPY --from=builder /app .
COPY . .
RUN yarn build
CMD ["node", "dist/entrypoint.js"]