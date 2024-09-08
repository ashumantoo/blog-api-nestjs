import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, matches, MaxLength, MinLength } from "class-validator";

/**
 * create User dto class
 */
export class CreateUserDto {
  /**
   * First name of user
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  firstName: string;

  /**
   * last name of user
   */
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(32)
  lastName?: string;

  /**
   * Email of user
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Password of user
   */
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