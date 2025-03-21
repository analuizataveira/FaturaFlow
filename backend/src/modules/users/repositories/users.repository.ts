import { randomInt } from "crypto";

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
    id: 2,
    name: "Mocked Jeca",
    email: "jeca@gmail.com",
  };

  return mockedUser;
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

export default { create, findById, find };
