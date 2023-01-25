import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = () => ({
    create: jest.fn(),
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    it('should create a user', async () => {
      const name = 'User 1';
      const email = 'user1@example.com';

      const user = await service.create(name, email);

      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
    });

    it('should prevent creating users with the same email', async () => {
      const name = 'User 1';
      const email = 'user1@example.com';

      const user1 = await service.create(name, email);

      const user2 = () => {
        return service.create(name, email);
      };

      expect(user2).toThrowError();
    });
  });
});
