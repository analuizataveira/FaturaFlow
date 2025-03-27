import usersRepository from "../repositories/users.repository";

const create = async (user: {
  name: string;
  email: string;
  password: string;
}) => {
  const userAlreadyExists = await usersRepository.findByEmail(user.email);

  if (userAlreadyExists) {
    return { msg: "User already exists" };
  }

  return usersRepository.create(user);
};

const findById = async (id: string) => {
  const user = usersRepository.findById(id);

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

export default { create, findById, find, softDelete };
