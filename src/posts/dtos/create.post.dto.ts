import { IsArray, IsDateString, IsEnum, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MinLength, ValidateNested } from "class-validator";
import { PostType } from "../enums/posttypes.enum";
import { PostStatus } from "../enums/post.status.enum";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
    description: "Array of tags passed as a string value",
    example: "['nestjs','typescript']"
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];


  /**
   * Type decorator: it does two things
   * 1. It matches the incoing requests to a particular dto, for example here the dto is CreateMetaOptionsDto, and
   *    Creates the instance of a particular dto for example CreateMetaOptionsDto in this case
   * 
   * 2. All the properties of the incoing request will be validated against the CreateMetaOptionsDto
   */
  //NOTE:nested object swagger setup
  @ApiPropertyOptional({
    type: "array",
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: "string",
          description: "The key can be identifire for your meta options",
          example: "sidebarEnabled"
        },
        value: {
          type: "any",
          description: "Any value that your want to save to the key",
          example: true
        }
      }
    }
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMetaOptionsDto)
  metaOptions?: CreateMetaOptionsDto[]
}

/**
 * Create meta option dto class
 */
export class CreateMetaOptionsDto {
  /**
   * key of meta option dto
   */
  @IsNotEmpty()
  @IsString()
  key: string;

  /**
   * Value of meta option dto
   */
  @IsNotEmpty()
  value: any;
}