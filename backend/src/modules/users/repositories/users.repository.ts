import { randomInt } from "crypto";
import { User } from "../models/user.type";
import { mongooseUser } from "../models/user.model";

const create = async (user: {
  name: string;
  email: string;
  password: string;
}) => {
  const mockedUser = {
    id: randomInt(20),
    name: user.name,
    email: user.email,
  };

  return mockedUser;
};

const findById = async (id: string) => {
  const mockedUser = {
    id: "2",
    name: "Mocked Jeca",
    email: "jeca@gmail.com",
  };

  return mockedUser;
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

const find = async () => {
  const mockedUsers = [
    {
      id: 2,
      name: "Mocked Jeca",
      email: "jeca@gmail.com",
    },
    {
      id: 3,
      name: "Mocked Jeca 3",
      email: "jeca3@gmail.com",
    },
  ];

  return mockedUsers;
};

const softDelete = async (id: string): Promise<User | null> => {
  const user = await mongooseUser.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
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
