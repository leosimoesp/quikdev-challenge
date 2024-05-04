const BcryptCipher = require('../src/infra/security/BcryptCipher');

test('Should encrypt a value using bcrypt', async function () {
  const bcryptCipher = BcryptCipher();
  const value = await bcryptCipher.encrypt('123456');
  expect(value).toBeDefined();
});

test('Should compare a hash successfull using bcrypt', async function () {
  const bcryptCipher = BcryptCipher();
  const isEqual = await bcryptCipher.compare(
    '123456',
    '$2b$10$sejJpk/.a7FGNSPGZBX5O.cK5WnGT6B3LUcIw43ywTmv/OFXptURS'
  );
  expect(isEqual).toBe(true);
});

test('Should result false if hash is not equal', async function () {
  const bcryptCipher = BcryptCipher();
  const isEqual = await bcryptCipher.compare(
    '123456',
    '$2b$10$sejJpk/.a7FGNSPGZBX5O.cK5WnGT6B3LUcIw43ywTmv/OFXptURA'
  );
  expect(isEqual).toBe(false);
});
