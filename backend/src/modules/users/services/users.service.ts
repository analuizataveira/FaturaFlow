import usersRepository from "../repositories/users.repository";
import authService from "../../auth/services/auth.service";

const login = async (user: { email: string; password: string }) => {
  const foundUser = await usersRepository.findByEmail(user.email);

  if (!foundUser) {
    return { msg: "User not found!" };
  }

  const isAuthenticated = await authService.comparePassword(
    user.password,
    foundUser.password
  );

  if (!isAuthenticated) {
    return { msg: "Password mismtach!" };
  }

  const { email, name } = foundUser;

  const token = authService.createJWT({ email, name });

  return { token };
};

const create = async (user: {
  name: string;
  email: string;
  password: string;
}) => {
  const userAlreadyExists = await usersRepository.findByEmail(user.email);

  if (userAlreadyExists) {
    return null;
  }

  return await usersRepository.create({
    ...user,
    password: await authService.encryptPassword(user.password),
  });
};

const findById = async (id: string) => {
  const user = await usersRepository.findById(id);

  if (!user) {
    return { msg: "User not found" };
  }

  return user;
};

const find = async () => {
  return await usersRepository.find();
};

const softDelete = async (id: string) => {
  const user = await usersRepository.findById(id);

  if (!user) {
    return { msg: "User not found" };
  }

  return await usersRepository.softDelete(id);
};

export default { login, create, findById, find, softDelete };
