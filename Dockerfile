# Usa una imagen base oficial de Node.js
FROM node:20.17.0-alpine3.20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de la aplicación al contenedor
COPY package*.json ./
COPY app.js ./
COPY public ./public

# Instala las dependencias de la aplicación
RUN npm install

# Expon el puerto en el que correrá la aplicación
EXPOSE 3000

# Define el comando para correr la aplicación
CMD ["node", "app.js"]
