import { FastifyReply, FastifyRequest } from "fastify";
import usersService from "../services/users.service";
import { createUserDTO } from "../dtos/create.dto";
import { mongooseIdDTO } from "../../../shared/dtos/mongo-id.dto";

const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const { body } = request;
  const userData = createUserDTO(body);

  const result = await usersService.create(userData);

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

export default { create, findById, find };
