import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  ValidationPipe
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user-dto";
import { GetUserParamsDto } from "./dtos/get-user-params-dto";
import { PatchUserDto } from "./dtos/patch-user-dto";
import { UsersService } from "./providers/users.service";


@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get('/:id')
  public getUsers(
    @Param() getUserParamsDto: GetUserParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseBoolPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseBoolPipe) page: number,
  ) {
    return this.usersService.findAll(getUserParamsDto, limit, page)
  }

  @Post()
  public createUsers(
    @Body() createUserDto: CreateUserDto
  ) {
    console.log(createUserDto);
    return 'You sent a post request to users endpoint';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}