import { z } from 'zod';

const createSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string(),
  name: z.string().min(1, 'Name is required'),
});

export function createUserDTO(user: unknown) {
  const parsedUser = createSchema.parse(user);

  return parsedUser;
}
