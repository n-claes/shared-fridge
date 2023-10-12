import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity.js";

export const deleteRecipe = async (userName: string, recipeName: string) => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(
    Recipe, { name: recipeName, belongsTo: userName }
  );
  await em.removeAndFlush(recipe);
};
