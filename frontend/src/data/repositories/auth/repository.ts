import { User } from '@/domain/interfaces/User';
import { BaseRepository } from '../base';

export class AuthRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async login(email: string, password: string) {
    const response = await this.httpClient.post(`${this.path}/login`, {
      email,
      password,
    });

    if (!response || !response.data) {
      throw new Error('Email ou senha inválidos. Por favor, verifique suas credenciais.');
    }

    return {
      success: true,
      data: response.data
    };
  }

  async createUser(user: User) {
    const response = await this.httpClient.post(`${this.path}`, user);

    if (!response || !response.data) {
      throw new Error('Erro ao criar usuário. Por favor, verifique os dados informados.');
    }

    return {
      success: true,
      data: response.data
    };
  }

}
