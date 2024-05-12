import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import * as argon from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(findOption): Promise<User[]> {
    try {
      return await this.userRepository.find(findOption);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findOne(findOption: FindOneOptions): Promise<User> {
    try {
      return await this.userRepository.findOne(findOption);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async createOne(dto: CreateUserDto): Promise<User> {
    console.log('name....................');
    const newUSer = new User();
    newUSer.username = dto.username;
    newUSer.email = dto.email;
    newUSer.password = await argon.hash(dto.password);

    newUSer.user_type = dto.user_type;
    const savedOne = await this.userRepository.save(newUSer);
    return savedOne;
    // const user = this.userRepository.create(dto);

    // console.log('user....................', user);
    // const savedOne = await this.userRepository.save(user);
    // return savedOne;
  }

  async updateOne(dto: User) {
    await this.userRepository.update({ id: dto.id }, dto);
    return this.findOneById(dto.id);
  }
}
