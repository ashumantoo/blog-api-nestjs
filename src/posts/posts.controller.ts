import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { get } from 'http';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create.post.dto';
import { PatchPostDto } from './dtos/patch.post.dto';

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
  public getPosts() {
    return this.postsService.getAllPosts();
  }

  /**
   * Get all posts of a user
   */
  @Get()
  public getPostsByUserId(@Param('userId') userId: string) {
    return this.postsService.getAllPostsByUserId(userId);
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
  public createPost(@Body() createPostDto: CreatePostDto) {
    return {
      success: true,
      message: "New post created successfully",
      data: createPostDto
    }
  }


  /**
   * Update a post
   */
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
  }
}
