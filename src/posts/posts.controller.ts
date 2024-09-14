import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { get } from 'http';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create.post.dto';
import { PatchPostDto } from './dtos/patch.post.dto';
import { GetPostsDto } from './dtos/get.post.dto';
import { ActiveUser } from 'src/auth/decorators/auth/active.user.decorator';
import { IActiveUser } from 'src/auth/interfaces/active.user.interface';

/**
 * Post controller class
 */
@Controller('posts')
@ApiTags("Posts")
export class PostsController {
  /**
   * Injecting posts services
   */
  constructor(
    private readonly postsService: PostsService
  ) { }

  /**
   * Get /posts
   */
  @Get()
  public getPosts(
    @Query() postQuery: GetPostsDto
  ) {
    return this.postsService.getAllPosts(postQuery);
  }

  /**
   * Get all posts of a user
   */
  @Get('/author/:id')
  public getPostsByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getAllPostsByUserId(id);
  }


  /**
   * Create a new post
   */
  @ApiOperation({
    summary: "Create a new blog post"
  })
  @ApiResponse({
    status: 201,
    description: "Post is created successfully"
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: IActiveUser) {
    return this.postsService.create(createPostDto, user);
  }


  /**
   * Update a post
   */
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.update(patchPostDto);
  }

  @Delete(':id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deleteById(id);
  }
}
