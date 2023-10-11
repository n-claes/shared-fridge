import { Entity, PrimaryKey, PrimaryKeyType, Property } from "@mikro-orm/core";
import { IsNumber, IsString } from "class-validator";

@Entity()
export class Product {

  @PrimaryKey()
  @IsString()
  public name: string;

  @PrimaryKey()
  @IsString()
  public belongsTo: string;

  [PrimaryKeyType]?: [string, string];

  @Property()
  @IsNumber()
  public size: number;
}
