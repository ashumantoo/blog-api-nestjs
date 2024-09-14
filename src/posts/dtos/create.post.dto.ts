import { IsArray, IsDateString, IsEnum, IsInt, IsISO8601, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";
import { PostType } from "../enums/posttypes.enum";
import { PostStatus } from "../enums/post.status.enum";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreatePostMetaOptionsDto } from "src/meta-option/dtos/create.post.meta.option.dto";
import { Unique } from "typeorm";

/** Create post dto class */
export class CreatePostDto {
  /**Title of the post */
  @ApiProperty({
    description: "Title of blog",
    example: "This is a title"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(512)
  title: string;


  /**Type of the post */
  @ApiProperty({
    enum: PostType,
    description: "Possible values are POST,PAGE,STORY,SERIES"
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;


  /**Slug of the post */
  @ApiProperty({
    description: "For example - 'my-url'",
    example: "my-blog-post"
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  /**Status of the post */
  @ApiProperty({
    enum: PostStatus,
    description: "Possible values are DRAFT,SCHEDULED,REVIEW,PUBLISHED"
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;


  /**content of the post */
  @ApiPropertyOptional({
    description: "This is content of the blog",
    example: "The post content"
  })
  @IsString()
  @IsOptional()
  content?: string;


  /**Schema of the post */
  @ApiPropertyOptional({
    description: "Serialize your JSON object else validation error will be thrown",
    example: "{\r\n    \"@context\": \"https:\/\/schema.org\",\r\n    \"@type\": \"Person\"\r\n  }"
  })
  @IsOptional()
  @IsJSON()
  schema?: string;


  /**featured Image url of the post */
  @ApiPropertyOptional({
    description: "This is the url of the blog image",
    example: "http://localhost.com/posts/image1.jpeg"
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl: string;


  /**Publish on date of the post */
  @ApiPropertyOptional({
    description: "Blog publish date",
    example: "2024-09-07T17:50:09+0000"
  })
  @IsOptional()
  @IsISO8601()
  publishOn?: Date;


  /**tags of the post */
  @ApiPropertyOptional({
    description: "Array of ids of Tags",
    example: "[1,2]"
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  tags?: number[];


  /**
   * Type decorator: it does two things
   * 1. It matches the incoing requests to a particular dto, for example here the dto is CreatePostMetaOptionsDto, and
   *    Creates the instance of a particular dto for example CreatePostMetaOptionsDto in this case
   * 
   * 2. All the properties of the incoming request will be validated against the CreatePostMetaOptionsDto
   */
  //NOTE:nested object swagger setup
  @ApiPropertyOptional({
    type: "object",
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: "string",
          description: "The meta value is a JSON string",
          example: "{\"sidebarEnabled\"}"
        }
      }
    }
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOption?: CreatePostMetaOptionsDto | null

  //Not required in the Dto now since now I am taking the logged in user data from req header
  // @ApiProperty({
  //   type: "integer",
  //   required: true,
  //   example: 1
  // })
  // @IsNumber()
  // @IsNotEmpty()
  // authorId: number;
}