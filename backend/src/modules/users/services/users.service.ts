import usersRepository from "../repositories/users.repository";
import authService from "../../auth/services/auth.service";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../shared/handlers/error-handler";
import defaultErrorMessages from "../../../shared/exceptions";

const login = async (user: { email: string; password: string }) => {
  const foundUser = await usersRepository.findByEmail(user.email);

  if (!foundUser) {
    throw new NotFoundError(defaultErrorMessages.USER_NOT_FOUND);
  }

  const isAuthenticated = await authService.comparePassword(
    user.password,
    foundUser.password
  );

  if (!isAuthenticated) {
    throw new UnauthorizedError(defaultErrorMessages.INVALID_PASSWORD);
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
    throw new BadRequestError(defaultErrorMessages.EMAIL_ALREADY_EXISTS);
  }

  return await usersRepository.create({
    ...user,
    password: await authService.encryptPassword(user.password),
  });
};

const findById = async (id: string) => {
  const user = await usersRepository.findById(id);

  if (!user) {
    throw new NotFoundError(defaultErrorMessages.USER_NOT_FOUND);
  }

  return user;
};

const find = async () => {
  return await usersRepository.find();
};

const softDelete = async (id: string) => {
  const user = await usersRepository.findById(id);

  if (!user) {
    throw new NotFoundError(defaultErrorMessages.USER_NOT_FOUND);
  }

  return await usersRepository.softDelete(id);
};

export default { login, create, findById, find, softDelete };
