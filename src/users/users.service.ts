import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(name: string, email: string, imageUrl?: string) {
    const user = this.repository.create({ name, email, imageUrl });

    return this.repository.save(user);
  }

  async findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  async find(email: string) {
    return this.repository.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    Object.assign(user, attrs);
    return this.repository.save(user);
  }
}
