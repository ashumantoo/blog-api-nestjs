import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(32)
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  //regular expression validation with custom message
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;
}