import { Entity, PrimaryKey, PrimaryKeyType, Property } from "@mikro-orm/core";
import { IsArray, IsString } from "class-validator";

@Entity()
export class Recipe {
  @PrimaryKey()
  @IsString()
  public name: string;

  @PrimaryKey()
  @IsString()
  public belongsTo: string;

  [PrimaryKeyType]?: [string, string];

  @Property()
  @IsString()
  public description: string;

  @Property({ type: "jsonb", default: "[]" })
  @IsArray()
  public ingredients: string[] = [];
}
