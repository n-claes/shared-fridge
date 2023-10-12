import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipes/recipe.body.js";
import { Recipe } from "../../../entities/recipe.entity.js";

export const updateRecipe = async (
  userName: string, recipeName: string, body: RecipeBody
) => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(
    Recipe, { name: recipeName, belongsTo: userName }
  );
  // workaround because recipe.assign does not work ("is not a function")??
  if (body.name) recipe.name = body.name;
  if (body.description) recipe.description = body.description;
  if (body.ingredients) recipe.ingredients = body.ingredients;
  await em.flush();
  return recipe;
}
