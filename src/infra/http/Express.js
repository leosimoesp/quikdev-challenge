const express = require('express');
const cors = require('cors');
const ExpressAdapter = require('../../adapter/ExpressAdapter');
const Parameters = require('../config/Parameters');
const AuthenticateController = require('../../controller/AuthenticateController');
const bodyParser = require('body-parser');
const dbmanager = require('../db/pgsql/manager/config');
const JwtSigner = require('../security/JwtSigner');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const jwtSigner = JwtSigner();
const envLoader = Parameters();
const authController = AuthenticateController(jwtSigner, envLoader);
const expressAdapter = ExpressAdapter(jwtSigner, envLoader);

app.post('/auth', (req, res) => {
  expressAdapter.create(authController.authenticate(req, res));
});

app.patch('/users', expressAdapter.validateTokenJWT, (req, res) => {
  res.status(200).json({
    message: 'User updated successfully',
  });
});

const port = envLoader.getEnv('PORT');

dbmanager.syncDB();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
