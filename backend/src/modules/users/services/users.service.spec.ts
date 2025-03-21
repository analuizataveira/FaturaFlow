import { randomInt } from "crypto";
import usersRepository from "../repositories/users.repository";
import usersService from "./users.service";

jest.mock("../repositories/users.repository");

const mockerUserRepository = usersRepository as jest.Mocked<
  typeof usersRepository
>;

describe("Users Service", () => {
  it("should create a user", async () => {
    const mockedUser = {
      id: randomInt(20),
      name: "Jeca",
      email: "jeca@gmail.com",
      password: "teste123",
    };

    mockerUserRepository.create.mockResolvedValueOnce(mockedUser);

    const result = await usersService.create(mockedUser);

    expect(result).toStrictEqual({
      ...mockedUser,
      id: expect.any(Number),
    });
  });

  it("should find a user by id", async () => {
    const mockedUser = {
      id: 2,
      name: "Jeca",
      email: "jeca@gmail.com",
      password: "teste123",
    };

    mockerUserRepository.findById.mockResolvedValueOnce(mockedUser);

    const result = await usersService.findById("2");

    expect(result).toStrictEqual({
      ...mockedUser,
      id: expect.any(Number),
    });
  });

  it("should find all users", async () => {
    const mockedUsers = [
      {
        id: 2,
        name: "Jeca",
        email: "jeca@gmail.com",
      },
      {
        id: 2,
        name: "Jeca",
        email: "jeca@gmail.com",
      },
    ];

    mockerUserRepository.find.mockResolvedValueOnce(mockedUsers);

    const result = await usersService.find();

    expect(result).toStrictEqual(mockedUsers);
  });
});
