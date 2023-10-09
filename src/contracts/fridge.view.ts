import { Exclude, Expose } from "class-transformer";
import { IsArray, IsNumber } from "class-validator";
import { User } from "../entities/user.entity.js";

@Exclude()
export class FridgeView {
  @Expose()
  @IsNumber()
  public location: number;

  @Expose()
  @IsNumber()
  public totalCapacity: number;

  @Expose()
  @IsNumber()
  public currentCapacity: number;

  @Expose()
  @IsArray()
  public users: User[];
}
