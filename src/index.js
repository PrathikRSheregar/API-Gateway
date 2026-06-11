const express = require('express');
const apiroutes = require('./routes');
const app = express();
const { serverconfig, logger } = require('./config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiroutes);
app.listen(serverconfig.PORT, () => {
   console.log(`server is listening to port ${serverconfig.PORT}`);
   logger.info("successfully started the server");
});