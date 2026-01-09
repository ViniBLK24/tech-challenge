import { User } from "@/domain/entities";
import { DatabaseRepository } from "../database/db.repository";

export class UserRepository {
  constructor(private dbRepository: DatabaseRepository) {}

  async findAll(): Promise<User[]> {
    const db = await this.dbRepository.read();
    return db.users;
  }

  async findById(id: number): Promise<User | undefined> {
    const db = await this.dbRepository.read();
    return db.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const db = await this.dbRepository.read();
    return db.users.find((user) => user.email === email);
  }

  async create(user: User): Promise<User> {
    const db = await this.dbRepository.read();
    const newUser: User = {
      ...user,
      id: user.id || Date.now(),
    };
    db.users.push(newUser);
    await this.dbRepository.write(db);
    return newUser;
  }
}

