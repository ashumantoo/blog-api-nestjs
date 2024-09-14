import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create.post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-option/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch.post.dto';
import { ConfigService } from '@nestjs/config';
import { GetPostsDto } from '../dtos/get.post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { IPagination } from 'src/common/pagination/interfaces/pagination.interface';
import { IActiveUser } from 'src/auth/interfaces/active.user.interface';

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
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly configService: ConfigService,
    private readonly paginationService: PaginationProvider
  ) { }

  /**Create new posts */
  public async create(createPostDto: CreatePostDto, activeUser: IActiveUser) { //active user is logged in user and available in the req header
    try {
      let tags = null;
      const user = await this.usersService.findOneById(activeUser.sub);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (createPostDto.tags && createPostDto.tags.length) {
        tags = await this.tagsService.getMultipleTags(createPostDto.tags);
        if (!tags || tags.length !== createPostDto.tags.length) {
          throw new BadRequestException("Please check your tag Ids and ensure they are correct")
        }
      }
      const newPost = this.postRepository.create({
        ...createPostDto,
        author: user,
        tags
      });
      return await this.postRepository.save(newPost);
    } catch (error) {
      throw error;
    }
  }

  public async update(patchPostDto: PatchPostDto) {
    try {
      const tags = await this.tagsService.getMultipleTags(patchPostDto.tags);
      if (!tags || tags.length !== patchPostDto.tags.length) {
        throw new BadRequestException("Please check your tag Ids and ensure they are correct")
      }
      const post = await this.postRepository.findOneBy({ id: patchPostDto.id });
      if (!post) {
        throw new NotFoundException("Post not found");
      }
      //update the new value of each property, ?? <-- null coalescing operator
      post.title = patchPostDto.title ?? post.title;
      post.slug = patchPostDto.slug ?? post.slug;
      post.content = patchPostDto.content ?? post.content;
      post.postType = patchPostDto.postType ?? post.postType;
      post.status = patchPostDto.status ?? post.status;
      post.schema = patchPostDto.schema ?? post.schema;
      post.publishOn = patchPostDto.publishOn ?? post.publishOn;
      post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;

      //Assign the new tags
      post.tags = tags;

      //save the post and return
      return await this.postRepository.save(post);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch All the posts
   */
  public async getAllPosts(postQuery: GetPostsDto): Promise<IPagination<Post>> {
    try {
      //With eagar
      // const posts = await this.postRepository.find();

      //Without eager - populating the data
      // const posts = await this.postRepository.find({
      //   relations: {
      //     metaOption: true,
      //     author: true, //key will same as what we have defined in entity file
      //     tags: true
      //   },
      //   skip: (postQuery.page - 1) * postQuery.limit,
      //   take: postQuery.limit
      // });
      const posts = await this.paginationService.paginateQuery({
        limit: postQuery.limit,
        page: postQuery.page
      }, this.postRepository)
      return posts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch all the post of a user
   */
  public async getAllPostsByUserId(authorId: number) {
    try {
      const posts = await this.postRepository.find({
        where: {
          author: { id: authorId }
        }
      });
      return posts;
    } catch (error) {
      throw error;
    }
  }

  public async deleteById(id: number) {
    try {
      /** Without using the CASCADE
       const post = await this.postRepository.findOneBy({ id });
       await this.postRepository.delete(id);
       await this.metaOptionRepostory.delete(post.metaOption.id);
 
     - with CASCADE, meta-option will also be delted automatically
     - In Bi-directional and Many to one and one-to-many relationship like post and user here the CASCASE if defined under the hood 
       if we delete the post the relationship table with tags is also will be deleted since tag and post are created in a different table 
       and this will just delte the relationship table row not the actual tags
     */
      await this.postRepository.delete(id);
      return { deleted: true, id }
    } catch (error) {
      throw error;
    }
  }
}
