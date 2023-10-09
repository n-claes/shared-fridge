import { Exclude, Expose } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";
import { User } from "../entities/user.entity.js";

@Exclude()
export class FridgeBody {
  @Expose()
  @IsNumber()
  public location: number;

  @Expose()
  @IsNumber()
  public totalCapacity: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  public currentCapacity: number;

  @Expose()
  @IsArray()
  @IsOptional()
  public users: User[];
}
