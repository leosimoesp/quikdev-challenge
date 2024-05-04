const crypto = require('crypto');
const JwtSigner = require('../src/infra/security/JwtSigner');

test('Should generate a valid jwt token', async function () {
  const secret = crypto.randomBytes(256).toString('hex');
  const jwtSigner = JwtSigner();
  const token = await jwtSigner.sign({ user: 'f45d-o145' }, secret, 300);
  expect(token).toBeDefined();
  expect(token.length).toBeGreaterThan(100);
  expect(token).toMatch(/^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]*$/);

  try {
    const isValid = await jwtSigner.verify(token, secret);
    expect(isValid).toBeTruthy();
  } catch (err) {
    expect(err).toBeUndefined();
  }
});

test('Should result error if jwt token is expired', async function () {
  const secret = crypto.randomBytes(256).toString('hex');
  const jwtSigner = JwtSigner();
  const token = await jwtSigner.sign({ user: 'f45d-o145' }, secret, 0);
  expect(token).toBeDefined();
  expect(token.length).toBeGreaterThan(100);
  expect(token).toMatch(/^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]*$/);

  try {
    const isValid = await jwtSigner.verify(token, secret);
    expect(isValid).toBeTruthy();
  } catch (err) {
    expect(err).toBeDefined();
    expect(err.message).toBe('jwt expired');
  }
});
