import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    limit?: number = 10; //default value = 10

    @IsOptional()
    @IsPositive()
    page?: number = 1; //default value = 1
}