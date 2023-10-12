import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity.js";

export const getRecipe = async(lastName: string, recipeName: string) => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(
    Recipe, { name: recipeName, belongsTo: lastName}
  )
  return recipe;
};
