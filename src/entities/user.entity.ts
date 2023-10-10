import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Product } from "./product.entity.js";

@Entity()
export class User {
  @PrimaryKey()
  public lastName: string;

  @Property()
  public firstName: string;

  @Property({unique: true})
  public email: string;

  @Property()
  public password: string;

  @Property({ type: "jsonb", default: "[]" })
  public products: Product[];
}
