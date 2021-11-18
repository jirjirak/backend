import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

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

  async whoAmI(user: User): Promise<User> {
    const userInfo = await this.userRepository.findOne({
      where: { id: user.id },
      select: ['id', 'firstName', 'lastName', 'username', 'displayName', 'isSystemAdmin', 'isSystemOwner'],
    });

    return userInfo;
  }

  createPassword(password: string): string {
    return crypto
      .createHash('sha256')
      .update(password + 'secretekey')
      .digest('hex');
  }

  async createSystemOwner(data: RegisterBodyDto): Promise<User> {
    const existAnyUser = await this.userRepository.findOne();

    if (existAnyUser) {
      return;
    }

    const password = this.createPassword(data.password);

    const owner = await this.userRepository.createAndSave({
      ...data,
      username: data.email,
      password,
      displayName: data.firstName + ' ' + data.lastName,
      emailVerified: true,
      isSystemOwner: true,
      phoneNumberVerified: true,
    });

    return owner;
  }

  async createUser(data: RegisterBodyDto): Promise<User> {
    const exist = await this.userRepository.count({
      where: { email: data.email },
    });

    if (exist) {
      throw new BadRequestException('user exist already');
    }

    const password = this.createPassword(data.password);

    const user = await this.userRepository.createAndSave({
      ...data,
      username: data.email,
      password,
      displayName: data.firstName + ' ' + data.lastName,
    });

    return user;
  }

  async checkUserCredential(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email, password: this.createPassword(password) },
    });

    if (!user) {
      throw new BadRequestException('invalid credential');
    }

    return user;
  }
}
