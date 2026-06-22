# frontend/Dockerfile
# imagem base: Node 20 versão alpine (mais leve)
# alpine = distro linux minimalista
FROM node:20-alpine

# define o diretorio de trabalho dentro do container
WORKDIR /app

# copia PRIMEIRO so os arquivosde dependecias
COPY package.json package-lock.json* ./

# instala as dependecias
RUN npm install

# copia o restante do codigo
COPY . .

# expoe a porta que o Vite usa por padrão
EXPOSE 5173

# comando para iniciar o server de dev
# --host 0.0.0.0 é ORBIGATORIO em docker, sem isso o vite escuta
# apenas no localhost DENTRO do container, e não é possivel acessar fora
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

