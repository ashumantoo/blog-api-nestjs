import { IsInt, IsOptional } from "class-validator";
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from "@nestjs/swagger";

/**
Since we get params as a string and here in GetUserParamsDto we are expecting it as an integer
so that we need to convert the incoming params from string to interger and we are achiving here by 
using @Type decorator from class-transforer package.
*/
export class GetUserParamsDto {
    /**
     * For swagger
     */
    @ApiPropertyOptional({
        description: "Get user with a specific id",
        example: 1234
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: string;
}