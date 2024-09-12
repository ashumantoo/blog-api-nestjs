import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create.user.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyUserDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'User'
    }
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ //Validate each and every property inside the nest object
    each: true
  })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}