import usersRepository from "../repositories/users.repository";

const create = async () => {
  return usersRepository.create();
};

export default { create };
