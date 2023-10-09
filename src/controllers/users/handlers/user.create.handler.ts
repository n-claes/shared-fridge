import { UserBody } from "../../../contracts/users/user.body.js";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";

export const create = async (body: UserBody) => {
  const em = RequestContext.getEntityManager();
  const newUser = em.create(User, body);
  await em.persistAndFlush(newUser);
  return newUser;
};
