import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipes/recipe.body.js";
import { Recipe } from "../../../entities/recipe.entity.js";
import { User } from "../../../entities/user.entity.js";

export const create = async (body: RecipeBody, userName: string) => {
  const em = RequestContext.getEntityManager();
  await em.findOneOrFail(User, { lastName: userName });
  if (await em.findOne(Recipe, { name: body.name, belongsTo: userName})) {
    throw new Error("Recipe already exists");
  }
  const newRecipe = em.create(Recipe, body);
  newRecipe.belongsTo = userName;
  await em.persistAndFlush(newRecipe);
  return newRecipe;
}
