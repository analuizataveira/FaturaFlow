import { FastifyReply, FastifyRequest } from "fastify";
import usersService from "../services/users.service";
import { createUserDTO } from "../dtos/create.dto";
import { mongooseIdDTO } from "../../../shared/dtos/mongo-id.dto";
import { loginDTO } from "../dtos/login.dto";

const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const { body } = request;
  const { email, password } = loginDTO(body);

  const result = await usersService.login({ email, password });

  reply.status(200).send(result);
};

const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const { body } = request;
  const userData = createUserDTO(body);

  const result = await usersService.create(userData);

  if (!result) {
    return reply.status(400).send({ msg: "Email already exists" });
  }

  return reply.status(201).send(result);
};

const findById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { params } = request;

  const id = mongooseIdDTO(params);

  const result = await usersService.findById(id);

  return reply.status(200).send(result);
};

const find = async (request: FastifyRequest, reply: FastifyReply) => {
  const result = await usersService.find();

  return reply.status(201).send(result);
};

const softDelete = async (request: FastifyRequest, reply: FastifyReply) => {
  const { params } = request;

  const id = mongooseIdDTO(params);

  const result = await usersService.softDelete(id);

  return reply.status(200).send(result);
};

export default { login, create, findById, find, softDelete };
