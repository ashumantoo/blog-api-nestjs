import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create.post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-option/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch.post.dto';
import { ConfigService } from '@nestjs/config';

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
    private readonly configService: ConfigService
  ) { }

  /**Create new posts */
  public async create(createPostDto: CreatePostDto) {
    const user = await this.usersService.findOneById(createPostDto.authorId);
    const tags = await this.tagsService.getMultipleTags(createPostDto.tags);
    const newPost = this.postRepository.create({
      ...createPostDto,
      author: user,
      tags
    });
    return await this.postRepository.save(newPost);
  }

  public async update(patchPostDto: PatchPostDto) {
    const tags = await this.tagsService.getMultipleTags(patchPostDto.tags);
    const post = await this.postRepository.findOneBy({ id: patchPostDto.id });

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
  }

  /**
   * Fetch All the posts
   */
  public async getAllPosts() {
    const S3_BUCKET = this.configService.get('S3_BUCKET');
    console.log("HHHHHHHHH-----", S3_BUCKET);
    //With eagar
    // const posts = await this.postRepository.find();

    //Without eager - populating the data
    const posts = await this.postRepository.find({
      relations: {
        metaOption: true,
        author: true, //key will same as what we have defined in entity file
        tags: true
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

    - with CASCADE, meta-option will also be delted automatically
    - In Bi-directional and Many to one and one-to-many relationship like post and user here the CASCASE if defined under the hood 
      if we delete the post the relationship table with tags is also will be deleted since tag and post are created in a different table 
      and this will just delte the relationship table row not the actual tags
    */
    await this.postRepository.delete(id);
    return { deleted: true, id }
  }
}
