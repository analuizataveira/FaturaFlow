import { BaseRepository } from "./base";
import { userRepository } from "./user.repository";
import { InvoiceRepository } from "./invoice/repository";
import { AuthRepository } from "./auth/repository";

export const repository = {
  base: new BaseRepository(""),
  user: userRepository,
  auth: new AuthRepository(),
  invoice: new InvoiceRepository(),
};
