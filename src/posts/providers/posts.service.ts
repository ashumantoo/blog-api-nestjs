import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create.post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-option/meta-option.entity';

/** 
 -->Below code is not required since I have used cascade propery on post OneToOne() mapping
    this will automatically create the meta option row in the table if meta option present in the request body

  const metaOption = createPostDto.metaOption
    ? this.metaOptionRepostory.create(createPostDto.metaOption)
    : null

  if (metaOption) {
    await this.metaOptionRepostory.save(metaOption);
  }
  if (metaOption) {
    newPost.metaOption = metaOption;
  } 
*/


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
    const user = await this.usersService.findOneById(createPostDto.authorId);
    const newPost = this.postRepository.create({
      ...createPostDto,
      author: user
    });
    return await this.postRepository.save(newPost);
  }

  /**
   * Fetch All the posts
   */
  public async getAllPosts() {
    //With eagar
    // const posts = await this.postRepository.find();

    //Without eager - populating the data
    const posts = await this.postRepository.find({
      relations: {
        metaOption: true,
        author: true //key will same as what we have defined in entity file
      }
    });
    return posts;
  }

  /**
   * Fetch all the post of a user
   */
  public getAllPostsByUserId(userId: string) {
    // const user = this.usersService.findOneById(userId);
    return {
      success: true,
      status: 200,
      data: []
    };
  }

  public async deleteById(id: number) {
    /** Without using the CASCADE
      const post = await this.postRepository.findOneBy({ id });
      await this.postRepository.delete(id);
      await this.metaOptionRepostory.delete(post.metaOption.id);
     */

    //with CASCADE, meta-option will also be delted automatically
    await this.postRepository.delete(id);
    return { deleted: true, id }
  }
}
