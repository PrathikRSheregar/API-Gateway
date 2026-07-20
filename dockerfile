FROM node:22

RUN apt-get update && apt-get install -y git

WORKDIR /developer/nodejs


RUN git clone https://github.com/PrathikRSheregar/API-Gateway.git api-gateway

WORKDIR /developer/nodejs/api-gateway


ENV NODE_ENV=production


RUN npm ci


COPY fetch-config.sh /fetch-config.sh


RUN chmod +x /fetch-config.sh


ENTRYPOINT ["/fetch-config.sh"]


CMD ["npm", "run", "dev"]