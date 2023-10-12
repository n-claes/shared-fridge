import { Body, JsonController, Param, Post } from "routing-controllers";
import { RecipeView } from "../../contracts/recipes/recipe.view.js";
import { Representer, StatusCode } from "@panenco/papi";
import { RecipeBody } from "../../contracts/recipes/recipe.body.js";
import { create } from "./handlers/recipe.create.handler.js";

@JsonController("/recipes")
export class RecipeController {
  @Post("/:lastName")
  @Representer(RecipeView, StatusCode.created)
  async create(@Param("lastName") lastName: string, @Body() body: RecipeBody) {
    return create(body, lastName);
  }
}
