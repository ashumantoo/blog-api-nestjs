import { ConflictException, Injectable } from '@nestjs/common';
import { IGoogleUser } from '../interfaces/google.user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    /**
     * Inject usersRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  public async createGoogleUser(googleUser: IGoogleUser) {
    try {
      const user = this.usersRepository.create({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        googleId: googleUser.googleId,
        email: googleUser.email,
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not create a new user',
      });
    }
  }
}
