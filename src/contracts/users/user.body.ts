import { Exclude, Expose } from "class-transformer";
import { IsArray, IsEmail, IsOptional, IsString, Length } from "class-validator";
import { Product } from "../../entities/product.entity.js";

@Exclude()
export class UserBody {
  @Expose()
  @IsString()
  public firstName: string;

  @Expose()
  @IsString()
  public lastName: string;

  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @IsString()
  public password: string;
}
