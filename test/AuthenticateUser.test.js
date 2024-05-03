const {
  UserRepositoryMemory,
} = require("../src/core/repository/UserRepositoryMemory");
const AuthenticateUser = require("../src/core/usecase/AuthenticateUser");

test("Should authenticate an user", async function () {
  const userRepositoryMemory = UserRepositoryMemory();
  const user = await userRepositoryMemory.create({
    email: "user@email.com",
    password: "123456",
    name: "User",
  });

  expect(user.email).toBe("user@email.com");
  expect(user.password).toBe("123456");
  expect(user.name).toBe("User");
  expect(user.id).toBeDefined();
  expect(user.isValid()).toBe(true);

  const authenticateUser = AuthenticateUser(userRepositoryMemory);

  try {
    const isAuthenticated = await authenticateUser.execute(
      "user@email.com",
      "123456"
    );
    expect(isAuthenticated).toBe(true);
  } catch (err) {
    expect(err).toBeUndefined();
  }
});

test("Should results error if password is not equal", async function () {
  const userRepositoryMemory = UserRepositoryMemory();
  const user = await userRepositoryMemory.create({
    email: "user@email.com",
    password: "123456",
    name: "User",
  });

  expect(user.email).toBe("user@email.com");
  expect(user.password).toBe("123456");
  expect(user.name).toBe("User");
  expect(user.id).toBeDefined();
  expect(user.isValid()).toBe(true);

  const authenticateUser = AuthenticateUser(userRepositoryMemory);

  try {
    const isAuthenticated = await authenticateUser.execute(
      "user@email.com",
      "abscdff525"
    );
    expect(isAuthenticated).toBe(false);
  } catch (err) {
    expect(err).toBeUndefined();
  }
});

test("Should result invalid user error if password is invalid", async function () {
  const userRepositoryMemory = UserRepositoryMemory();

  try {
    const user = await userRepositoryMemory.create({
      email: "user@email.com",
      password: "",
      name: "User",
    });
  } catch (err) {
    expect(err.message).toBe("Invalid User");
  }
});

test("Should result invalid user error if e-mail is invalid", async function () {
  const userRepositoryMemory = UserRepositoryMemory();

  try {
    const user = await userRepositoryMemory.create({
      email: "",
      password: "123456",
      name: "User",
    });
  } catch (err) {
    expect(err.message).toBe("Invalid User");
  }
});
