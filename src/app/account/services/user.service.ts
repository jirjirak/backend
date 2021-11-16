import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async authenticateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user;
  }
}
