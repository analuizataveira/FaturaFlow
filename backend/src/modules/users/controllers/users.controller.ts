import { FastifyReply, FastifyRequest } from "fastify";
import usersService from "../services/users.service";

const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const result = await usersService.create();

  return reply.status(200).send(result);
};

export default { create };
