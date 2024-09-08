import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create.post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-option/meta-option.entity';

/**
 * Post service class
 */

@Injectable()
export class PostsService {
  /**
   * Constructor to use different service injection
   */
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    //We need to import this in post.module.ts file
    private metaOptionRepostory: Repository<MetaOption>,
    private readonly usersService: UsersService
  ) { }

  /**Create new posts */
  public async create(createPostDto: CreatePostDto) {
    const metaOption = createPostDto.metaOption
      ? this.metaOptionRepostory.create(createPostDto.metaOption)
      : null

    if (metaOption) {
      await this.metaOptionRepostory.save(metaOption);
    }
    const newPost = this.postRepository.create(createPostDto);

    if (metaOption) {
      newPost.metaOption = metaOption;
    }

    return await this.postRepository.save(newPost);
  }

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
