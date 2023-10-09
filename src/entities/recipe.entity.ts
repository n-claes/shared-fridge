import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Recipe {
  @PrimaryKey()
  public name: string;

  @Property()
  public description: string;

  @Property({ type: "jsonb", default: "[]" })
  public ingredients: string[] = [];
}
