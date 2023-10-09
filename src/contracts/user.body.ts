import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

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
