import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, matches, MaxLength, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user-dto";

/***************** Mapped types *****************
 *  This package from NestJS help us to inherit specific DTO and allows us to import
 *  some or only few part of a different DTO, by using this we can do partial imports 
 *  or we can pick or omit and we can also perform intersection of dto
 */

//Now this line make all the fields of createUserDto as optional for patch/update the user
export class PatchUserDto extends PartialType(CreateUserDto) { }


//NOTE:this is unnecessary duplicate code of create user dto
// export class PatchUserDto {
//     @IsString()
//     @IsNotEmpty()
//     @MinLength(3)
//     @MaxLength(32)
//     firstName: string;

//     @IsString()
//     @IsOptional()
//     @MinLength(3)
//     @MaxLength(32)
//     lastName?: string;

//     @IsNotEmpty()
//     @IsEmail()
//     email: string;

//     @IsString()
//     @IsNotEmpty()
//     @MinLength(8)
//     //regular expression validation with custom message
//     @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
//         message:
//             'Minimum eight characters, at least one letter, one number and one special character',
//     })
//     password: string;
// }