const {
  UserRepositoryMemory,
} = require('../src/infra/repository/UserRepositoryMemory');
const BcryptCipher = require('../src/infra/security/BcryptCipher');
const AuthenticateUser = require('../src/core/usecase/AuthenticateUser');

test('Should authenticate an user', async function () {
  const userRepositoryMemory = UserRepositoryMemory();
  const bcryptCipher = BcryptCipher();

  const user = await userRepositoryMemory.create({
    id: '91d3dbaf-5845-4597-8a83-667463f201c2',
    email: 'user@email.com',
    password: await bcryptCipher.encrypt('123456'),
    name: 'User',
  });

  expect(user.email).toBe('user@email.com');
  expect(user.password).toBeDefined();
  expect(user.name).toBe('User');
  expect(user.id).toBeDefined();
  expect(user.isValid()).toBe(true);

  const authenticateUser = AuthenticateUser(userRepositoryMemory, bcryptCipher);

  try {
    const { authenticated } = await authenticateUser.execute(
      'user@email.com',
      '123456'
    );
    expect(authenticated).toBe(true);
  } catch (err) {
    expect(err).toBeUndefined();
  }
});

test('Should results error if password is not equal', async function () {
  const userRepositoryMemory = UserRepositoryMemory();
  const user = await userRepositoryMemory.create({
    email: 'user@email.com',
    password: '123456',
    name: 'User',
  });

  expect(user.email).toBe('user@email.com');
  expect(user.password).toBe('123456');
  expect(user.name).toBe('User');
  expect(user.id).toBeDefined();
  expect(user.isValid()).toBe(true);

  const bcryptCipher = BcryptCipher();
  const authenticateUser = AuthenticateUser(userRepositoryMemory, bcryptCipher);

  try {
    const { authenticated } = await authenticateUser.execute(
      'user@email.com',
      'abscdff525'
    );
    expect(authenticated).toBe(false);
  } catch (err) {
    expect(err).toBeUndefined();
  }
});

test('Should result invalid user error if password is invalid', async function () {
  const userRepositoryMemory = UserRepositoryMemory();

  try {
    const user = await userRepositoryMemory.create({
      email: 'user@email.com',
      password: '',
      name: 'User',
    });
  } catch (err) {
    expect(err.message).toBe('Password can not be null');
  }
});

test('Should result invalid user error if e-mail is invalid', async function () {
  const userRepositoryMemory = UserRepositoryMemory();

  try {
    const user = await userRepositoryMemory.create({
      email: '',
      password: '123456',
      name: 'User',
    });
  } catch (err) {
    expect(err.message).toBe('E-mail can not be null');
  }
});
