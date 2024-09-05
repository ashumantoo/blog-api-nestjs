import { Injectable } from "@nestjs/common";
import { GetUserParamsDto } from "../dtos/get-user-params-dto";

@Injectable()
export class UsersService {
  public findAll(
    getUserParamsDto: GetUserParamsDto,
    limit: number,
    page: number
  ) {
    return [
      {
        firstName: "Mantoo",
        lastName: "Ashutosh"
      },
      {
        firstName: "KK",
        lastName: "MM"
      }
    ]
  }
}