import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product.entity.js";

@Entity()
export class Fridge {
  @PrimaryKey()
  public location: number;

  @Property()
  public totalCapacity: number;

  @Property()
  public currentCapacity: number;

  @Property({ type: "jsonb", default: "[]" })
  public products: Product[] = [];
}
