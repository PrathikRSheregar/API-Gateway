FROM node

WORKDIR /developer/nodejs/api-gateway

ENV NODE_ENV = production
COPY . .

RUN npm ci
RUN cd src && npx sequelize db:create
RUN cd src && npx sequelize db:migrate

CMD ["npm", "run", "dev"]
