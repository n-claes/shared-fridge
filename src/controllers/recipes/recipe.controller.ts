import { Delete, Get, JsonController, Param, Patch, Post } from "routing-controllers";
import { RecipeView } from "../../contracts/recipes/recipe.view.js";
import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { RecipeBody } from "../../contracts/recipes/recipe.body.js";
import { create } from "./handlers/recipe.create.handler.js";
import { getRecipe } from "./handlers/recipe.getRecipe.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { getAllRecipes } from "./handlers/recipe.getAllRecipes.js";
import { updateRecipe } from "./handlers/recipe.update.handler.js";
import { deleteRecipe } from "./handlers/recipe.delete.handler.js";

@JsonController("/recipes")
export class RecipeController {
  @Post("/:lastName")
  @Representer(RecipeView, StatusCode.created)
  async create(@Param("lastName") lastName: string, @Body() body: RecipeBody) {
    return create(body, lastName);
  }

  @Get()
  @ListRepresenter(RecipeView, StatusCode.ok)
  async getAllRecipes(@Query() query: SearchQuery) {
    return getAllRecipes(query.search);
  }


  @Get("/:lastName")
  @ListRepresenter(RecipeView, StatusCode.ok)
  async getAllUserRecipes(@Param("lastName") lastName: string) {
    return getAllRecipes(lastName);
  }


  @Get("/:lastName/:recipeName")
  @Representer(RecipeView, StatusCode.ok)
  async getRecipe(
    @Param("lastName") lastName: string, @Param("recipeName") recipeName: string
  ) {
    return getRecipe(lastName, recipeName);
  }


  @Patch("/:lastName/:recipeName")
  @Representer(RecipeView, StatusCode.ok)
  async updateRecipe(
    @Param("lastName") lastName: string,
    @Param("recipeName") recipeName: string,
    @Body({}, { skipMissingProperties: true }) body: RecipeBody
  ) {
    return updateRecipe(lastName, recipeName, body);
  }

  @Delete("/:lastName/:recipeName")
  @Representer(null)
  async deleteRecipe(
    @Param("lastName") lastName: string, @Param("recipeName") recipeName: string
  ) {
    return deleteRecipe(lastName, recipeName);
  }
}
