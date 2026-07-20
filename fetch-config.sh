#!/bin/bash
set -e

aws s3 cp s3://my-config-bucket/.env ./.env
aws s3 cp s3://my-config-bucket/config.json ./config.json

cd /developer/nodejs/api-gateway/src

npx sequelize db:create
npx sequelize db:migrate

cd /developer/nodejs/api-gateway
exec "$@"