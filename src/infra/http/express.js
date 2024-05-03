const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const ExpressAdapter = require('../../adapter/ExpressAdapter');
const AuthenticateController = require('../../controller/AuthenticateController');

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const authController = AuthenticateController();
const expressAdapter = ExpressAdapter();

app.post('/auth', (req, res) => {
  expressAdapter.create(authController.authenticate(req, res));
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
