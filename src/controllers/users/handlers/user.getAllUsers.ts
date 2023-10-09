import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity.js";

export const getAllUsers = async (search: string) => {
  const em = RequestContext.getEntityManager();
  return em.findAndCount(
		User,
		search
			? {
				$or: [
          {firstName: {$ilike: `%${search}%`}},
          {lastName: {$ilike: `%${search}%`}},
          {email: {$ilike: `%${search}%`}}],
			}
			: {}
	);
}
