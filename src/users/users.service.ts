import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(name: string, email: string) {
    const user = this.repository.create({ name, email });

    return this.repository.save(user);
  }

  async find(email: string) {
    return this.repository.find({ where: { email } });
  }
}
