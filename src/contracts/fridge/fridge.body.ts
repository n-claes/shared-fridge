import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

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
}
