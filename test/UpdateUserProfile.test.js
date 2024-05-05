const {
  UserRepositoryMemory,
} = require('../src/infra/repository/UserRepositoryMemory');
const BcryptCipher = require('../src/infra/security/BcryptCipher');
const UpdateUserProfile = require('../src/core/usecase/UpdateUserProfile');

test('Should update an user profile', async function () {
  const userRepositoryMemory = UserRepositoryMemory();
  const bcryptCipher = BcryptCipher();

  const user = await userRepositoryMemory.create({
    email: 'user@email.com',
    password: await bcryptCipher.encrypt('123456'),
    name: 'User',
  });

  expect(user.email).toBe('user@email.com');
  expect(user.password).toBeDefined();
  expect(user.name).toBe('User');
  expect(user.id).toBeDefined();
  expect(user.isValid()).toBe(true);

  const updateUserProfile = UpdateUserProfile(
    userRepositoryMemory,
    bcryptCipher
  );

  try {
    const updatedUser = await updateUserProfile.execute(user.id, {
      name: 'User Updated',
      password: '654321',
      email: 'user@email.com',
    });
    expect(updatedUser.id).toBe(user.id);
  } catch (err) {
    expect(err).toBeUndefined();
  }
});

test('Should result error if user is not own from profile', async function () {
  const userRepositoryMemory = UserRepositoryMemory();
  const bcryptCipher = BcryptCipher();

  const user = await userRepositoryMemory.create({
    email: 'user@email.com',
    password: await bcryptCipher.encrypt('123456'),
    name: 'User',
  });

  expect(user.email).toBe('user@email.com');
  expect(user.password).toBeDefined();
  expect(user.name).toBe('User');
  expect(user.id).toBeDefined();
  expect(user.isValid()).toBe(true);

  const updateUserProfile = UpdateUserProfile(
    userRepositoryMemory,
    bcryptCipher
  );

  try {
    await updateUserProfile.execute('16858e3b-3c10-4bd9-82f1-e333b4df2417', {
      name: 'User Updated',
      password: '654321',
      email: 'user@email.com',
    });
  } catch (err) {
    expect(err).toBeDefined();
    expect(err.message).toBe('You are not allowed to update this user');
  }
});
