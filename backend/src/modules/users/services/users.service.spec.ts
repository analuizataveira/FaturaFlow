import usersRepository from "../repositories/users.repository";
import usersService from "./users.service";

jest.mock("../repositories/users.repository");

const mockerUserRepository = usersRepository as jest.Mocked<
  typeof usersRepository
>;

describe("Users Service", () => {
  it("should create a user", async () => {
    const mockedUser = {
      id: "2",
      name: "Jeca",
      email: "jeca@gmail.com",
      password: "teste123",
    };

    mockerUserRepository.create.mockResolvedValueOnce(mockedUser);

    const result = await usersService.create(mockedUser);

    expect(result).toStrictEqual({
      ...mockedUser,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
    });
  });

  it("should throw an error if users already exists", async () => {
    const mockedUser = {
      id: "1",
      name: "Jeca",
      email: "jeca@gmail.com",
      password: "teste123",
    };

    mockerUserRepository.findByEmail.mockResolvedValueOnce(mockedUser);

    await expect(usersService.create(mockedUser)).rejects.toThrow(
      // eslint-disable-next-line prettier/prettier
      "Email already exists"
    );
  });

  it("should find a user by id", async () => {
    const mockedUser = {
      id: "2",
      name: "Jeca",
      email: "jeca@gmail.com",
      password: "teste123",
    };

    mockerUserRepository.findById.mockResolvedValueOnce(mockedUser);

    const result = await usersService.findById("2");

    expect(result).toStrictEqual({
      ...mockedUser,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
    });
  });

  it("should throw an error if users doesnt exists", async () => {
    mockerUserRepository.findByEmail.mockResolvedValueOnce(null);

    await expect(usersService.findById("2")).rejects.toThrow("User not found");
  });

  it("should find all users", async () => {
    const mockedUsers = [
      {
        id: "2",
        name: "Jeca",
        email: "jeca@gmail.com",
        password: "crypto",
      },
      {
        id: "2",
        name: "Jeca",
        email: "jeca@gmail.com",
        password: "crypto",
      },
    ];

    mockerUserRepository.find.mockResolvedValueOnce(mockedUsers);

    const result = await usersService.find();

    expect(result).toStrictEqual(mockedUsers);
  });

  it("should soft delete a user", async () => {
    const mockedUser = {
      id: "2",
      name: "Jeca",
      email: "jeca@gmail.com",
      password: "teste123",
    };

    mockerUserRepository.findById.mockResolvedValueOnce(mockedUser);

    mockerUserRepository.softDelete.mockResolvedValueOnce({
      ...mockedUser,
      isDeleted: true,
    });
    const result = await usersService.softDelete("2");

    expect(result).toMatchObject({
      ...mockedUser,
      isDeleted: true,
    });
  });

  it("should throw an error if users already exists on soft delete", async () => {
    const mockedUser = {
      id: "1",
      name: "Jeca",
      email: "jeca@gmail.com",
      password: "teste123",
    };

    mockerUserRepository.findByEmail.mockResolvedValueOnce(null);

    const result = await usersService.softDelete(mockedUser.id);

    expect(result).toStrictEqual({
      msg: "User not found",
    });
  });

});
