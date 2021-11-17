import { BadRequestException, Injectable } from '@nestjs/common';

import { RegisterBodyDto } from '../dto/user/register.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async authenticateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, blocked: false },
      select: ['id', 'isSystemAdmin', 'isSystemOwner'],
    });
    return user;
  }

  async createUser(data: RegisterBodyDto): Promise<User> {
    const exist = await this.userRepository.count({
      where: { email: data.email },
    });

    if (exist) {
      throw new BadRequestException('user exist already');
    }

    const user = await this.userRepository.createAndSave({
      ...data,
      username: data.email,
      displayName: data.firstName + ' ' + data.lastName,
    });

    return user;
  }
}
