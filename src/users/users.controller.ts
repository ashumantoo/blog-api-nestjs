import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create.user.dto";
import { GetUserParamsDto } from "./dtos/get.user.params.dto";
import { PatchUserDto } from "./dtos/patch.user.dto";
import { UsersService } from "./providers/users.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateManyUserDto } from "./dtos/create.many.user.dto";

/**
 * Users controller class to defined different users routes
 */
@Controller('users')
@ApiTags("Users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  /**
   * Get Users
   */
  @Get()
  //swagger info starts
  @ApiOperation({
    summary: 'Fetches a list of registred users on the application'
  })
  @ApiQuery({
    name: "limit",
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10
  })
  @ApiQuery({
    name: "page",
    type: 'number',
    required: false,
    description: 'The position of the page number that you want the API to return',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: "User fetched succesfuly"
  })
  //swagger info ends
  public getUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(limit, page)
  }

  /**
   * Get user by Id
   */

  @Get(':id')
  public getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }

  /**
   * Create new user
   */
  @Post()
  public createUser(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.usersService.createUser(createUserDto);
  }

  /**
  * Create many users
  * --> if we defined the dto like this createUserDto: CreateUserDto[], this will not add proper validation
  *     for nested object/Dto, it will just provide the type safety, Let say if we don't pass email in the 
  *     createUsersDto of an element, the api will still create the user in db. which wrong since we have made
  *     email is mandatory.
  * 
  * --> To sove this issue we need to defined a separate dto for create multiple users, which validate the createUserDto
  *     individually.
 
      @Post()
      public createUsers(
        @Body() createUsersDto: CreateUserDto[]
      ) {
        return this.usersService.createMany(createUsersDto);
      }
  */

  /**
   * Create many users using corrct dto
   */

  @Post()
  public createUsers(
    @Body() createManyUserDto: CreateManyUserDto
  ) {
    return this.usersService.createMany(createManyUserDto);
  }

  /**
   * Update existing user
   */
  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}