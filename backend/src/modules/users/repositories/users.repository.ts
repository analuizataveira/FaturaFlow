import { User } from '../models/user.type';
import { mongooseUser } from '../models/user.model';

const create = async (user: { email: string; password: string; name: string }): Promise<User> => {
  const createdUser = await mongooseUser.create(user);
  return {
    id: String(createdUser._id),
    email: createdUser.email,
    name: createdUser.name,
    password: createdUser.password,
    isDeleted: createdUser.isDeleted,
    updatedAt: createdUser.updatedAt,
    createdAt: createdUser.createdAt,
  };
};

const findById = async (id: string): Promise<User | null> => {
  return await mongooseUser.findById(id);
};

const findByEmail = async (email: string): Promise<User | null> => {
  const user = await mongooseUser.findOne({ email });

  if (!user) {
    return null;
  }

  const { _id, name, password, isDeleted, updatedAt, createdAt } = user;

  return {
    id: String(_id),
    email,
    name,
    password,
    isDeleted,
    updatedAt,
    createdAt,
  };
};

const find = async (): Promise<User[]> => {
  const users = await mongooseUser.find();

  return users.map(({ _id, email, name, password, isDeleted, updatedAt, createdAt }) => ({
    id: String(_id),
    email,
    name,
    password,
    isDeleted,
    updatedAt,
    createdAt,
  }));
};

const softDelete = async (id: string): Promise<User | null> => {
  const user = await mongooseUser.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  );

  if (!user) {
    return null;
  }

  const { _id, email, name, password, isDeleted, updatedAt, createdAt } = user;

  return {
    id: String(_id),
    email,
    name,
    password,
    isDeleted,
    updatedAt,
    createdAt,
  };
};

export default { create, findById, find, findByEmail, softDelete };
