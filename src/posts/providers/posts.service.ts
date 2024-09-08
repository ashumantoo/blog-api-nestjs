import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

/**
 * Post service class
 */

@Injectable()
export class PostsService {
  /**
   * Constructor to use different service injection
   */
  constructor(
    private readonly usersService: UsersService
  ) { }

  /**
   * Fetch All the posts
   */
  public getAllPosts() {
    return {
      success: true,
      status: 200,
      data: []
    };
  }

  /**
   * Fetch all the post of a user
   */
  public getAllPostsByUserId(userId: string) {
    const user = this.usersService.findOneById(userId);
    return {
      success: true,
      status: 200,
      data: []
    };
  }
}
