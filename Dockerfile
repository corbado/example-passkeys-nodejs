FROM node:20-alpine
ARG TARGETOS
ARG TARGETARCH

ENV PROJECT_ID \
    API_SECRET \

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]
