import { Exclude, Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { User } from "../entities/user.entity.js";
import { Product } from "../entities/product.entity.js";

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
  public products: Product[];
}
