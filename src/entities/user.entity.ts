import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

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
}
