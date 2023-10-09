import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";

export const getUser = async (lastName: string) => {
  const em = RequestContext.getEntityManager();
  const user = await em.findOneOrFail(User, {lastName});
  return user;
};
