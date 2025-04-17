import { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersController from "../controllers/users.controller";
export const usersRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) => {
  fastify.post("/", usersController.create);
  fastify.get("/:id", usersController.findById);
  fastify.get("/", usersController.find);
  fastify.post("/login", {}, usersController.login);

  done();
};
