FROM node:20-alpine

WORKDIR /app

# copia dependencias primeiro (cache em camadas)
COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 3000

# em dev usamos nodemon (hot reload)
# em prod usamos node diretamente
CMD ["npm", "run", "dev"]