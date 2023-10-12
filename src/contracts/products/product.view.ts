import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

@Exclude()
export class ProductView {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsNumber()
  public size: number;

  @Expose()
  @IsString()
  public belongsTo: string;

  @Expose()
  @IsBoolean()
  public inFridge: boolean;
}
