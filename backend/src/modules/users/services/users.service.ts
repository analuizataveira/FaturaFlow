import usersRepository from "../repositories/users.repository";

const create = async (user: {
  name: string;
  email: string;
  password: string;
}) => {
  return usersRepository.create(user);
};

const findById = async (id: string) => {
  return usersRepository.findById(id);
};

const find = async () => {
  return await usersRepository.find();
};

export default { create, findById, find };
