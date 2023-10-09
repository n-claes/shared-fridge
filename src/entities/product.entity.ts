import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { IsNumber, IsString } from "class-validator";

@Entity()
export class Product {
  @PrimaryKey()
  @IsString()
  public name: string;

  @Property()
  @IsNumber()
  public size: number;

  @Property()
  @IsString()
  public belongsTo: string;
}
