import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { IsOptional } from "class-validator";

@Entity()
export class Fridge {
  @PrimaryKey()
  public location: number;

  @Property()
  public totalCapacity: number;

  @Property()
  public currentCapacity: number;

  @Property()
  public users: User[];
}
