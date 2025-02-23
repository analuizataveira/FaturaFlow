import { FastifyReply, FastifyRequest } from "fastify";

const parseInvoices = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send("route not implemented yet");
};

export default { parseInvoices };
