import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity.js";
import { Product } from "../../../entities/product.entity.js";

export const getMissingIngredients = async (userName: string, recipeName: string) => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(
    Recipe, { name: recipeName, belongsTo: userName }
  );
  const neededIngredients = recipe.ingredients;
  const neededIngredientsOnuser = (
    await em.find(Product, { belongsTo: userName, inFridge: false})).filter(
      (product) => neededIngredients.includes(product.name)
  );
  const neededIngredientsInFridges = (
    await em.find(Product, { belongsTo: userName, inFridge: true})).filter(
      (product) => neededIngredients.includes(product.name)
  );

  // check if all ingredients needed actually exist on/in user/fridges.
  // If not, flag error and log missing ingredients.
  const neededIngredientNamesOnUser = neededIngredientsOnuser.map(
    (product) => product.name
  );
  const neededIngredientNamesInFridges = neededIngredientsInFridges.map(
    (product) => product.name
  );
  const missingIngredients = neededIngredients.filter(
    (ingredient) => (
      !neededIngredientNamesOnUser.includes(ingredient)
      && !neededIngredientNamesInFridges.includes(ingredient)
    )
  );
  if (missingIngredients.length > 0) {
    throw new Error(`Missing ingredients: ${missingIngredients.join(", ")}`);
  }
  return neededIngredientsInFridges;
};
