const express = require('express');
const cors = require('cors');
const ExpressAdapter = require('../../adapter/ExpressAdapter');
const ExpressErrorAdapter = require('../../adapter/ExpressErrorAdaper');
const Parameters = require('../config/Parameters');
const AuthenticateController = require('../../controller/AuthenticateController');
const UserController = require('../../controller/UserController');
const PostController = require('../../controller/PostController');

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
const userController = UserController();
const postController = PostController();
const expressAdapter = ExpressAdapter(jwtSigner, envLoader);

app.post('/auth', (req, res) => {
  expressAdapter.create(authController.authenticate(req, res));
});

app.patch('/users', expressAdapter.validateTokenJWT, (req, res, next) => {
  try {
    expressAdapter.create(userController.updateProfile(req, res, next));
  } catch (error) {
    next(error);
  }
});

app.post('/posts', expressAdapter.validateTokenJWT, (req, res, next) => {
  try {
    expressAdapter.create(postController.createPost(req, res, next));
  } catch (error) {
    next(error);
  }
});

app.patch('/posts/:id', expressAdapter.validateTokenJWT, (req, res, next) => {
  try {
    expressAdapter.create(postController.updatePost(req, res, next));
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
