import { BaseRepository } from './base';

export class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async login(email: string, password: string) {
    const response = await this.httpClient.post('/login', {
      email,
      password,
    });
    return response.data;
  }
}

export const userRepository = new UserRepository();
