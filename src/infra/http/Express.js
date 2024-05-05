const express = require('express');
const cors = require('cors');
const ExpressAdapter = require('../../adapter/ExpressAdapter');
const ExpressErrorAdapter = require('../../adapter/ExpressErrorAdaper');
const Parameters = require('../config/Parameters');
const AuthenticateController = require('../../controller/AuthenticateController');
const UpdateUserProfileController = require('../../controller/UpdateUserProfileController');

const bodyParser = require('body-parser');
const dbmanager = require('../db/pgsql/manager/config');
const JwtSigner = require('../security/JwtSigner');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(ExpressErrorAdapter);

const jwtSigner = JwtSigner();
const envLoader = Parameters();
const authController = AuthenticateController(jwtSigner, envLoader);
const updateUserProfileController = UpdateUserProfileController(
  jwtSigner,
  envLoader
);
const expressAdapter = ExpressAdapter(jwtSigner, envLoader);

app.post('/auth', (req, res) => {
  expressAdapter.create(authController.authenticate(req, res));
});

app.patch('/users', expressAdapter.validateTokenJWT, (req, res, next) => {
  try {
    expressAdapter.create(
      updateUserProfileController.updateProfile(req, res, next)
    );
  } catch (error) {
    next(error);
  }
});

const port = envLoader.getEnv('PORT');

dbmanager.syncDB();

app.use(ExpressErrorAdapter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
