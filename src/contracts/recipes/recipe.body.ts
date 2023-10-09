import { Exclude, Expose } from "class-transformer";
import { IsArray, IsString } from "class-validator";

@Exclude()
export class RecipeBody {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @IsArray()
  public ingredients: string[];
}
