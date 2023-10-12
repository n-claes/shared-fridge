import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity.js";

export const getAllRecipes = async (search: string) => {
  const em = RequestContext.getEntityManager();
  return em.findAndCount(
		Recipe,
		search
			? {
				$or: [
          {name: {$ilike: `%${search}%`}},
          {belongsTo: {$ilike: `%${search}%`}}],
			}
			: {}
	);
}
