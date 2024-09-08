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
   * Get Users where id is the optional parameter
   */
  @Get('/:id?')
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
    @Param() getUserParamsDto: GetUserParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUserParamsDto, limit, page)
  }

  /**
   * Create new user
   */
  @Post()
  public createUsers(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Update existing user
   */
  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}