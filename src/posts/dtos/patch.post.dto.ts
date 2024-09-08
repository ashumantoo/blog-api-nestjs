// import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreatePostDto } from "./create.post.dto";

/**
 * If we import PartialType() from "@nestjs/mapped-types" then swagger will not able to identify the other property of the CreatePostDto, since we have 
 * already defined all the property validation and swagger setup for CreatePostDto and we just extending that dto itself, swagger should automatically 
 * itendify all the defined property but it will not if we import PartialType from "@nestjs/mapped-types"
 * To solve this issue we need to import  PartialType() from "@nestjs/swagger" instead of "@nestjs/mapped-types"
 */
export class PatchPostDto extends PartialType(CreatePostDto) {
    /**
     * PatchPost dto id
     */
    @ApiProperty({
        description: "The ID of the post that needs to be updated"
    })
    @IsInt()
    @IsNotEmpty()
    id: number
}