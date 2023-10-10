import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { Get, JsonController, Param, Post } from "routing-controllers";
import { FridgeView } from "../../contracts/fridge/fridge.view.js";
import { FridgeBody } from "../../contracts/fridge/fridge.body.js";
import { createFridge } from "./handlers/fridge.create.handler.js";
import { SearchQuery, SearchQueryNumber } from "../../contracts/search.query.js";
import { getAllFridges } from "./handlers/fridge.getAllFridges.handler.js";
import { getFridge } from "./handlers/fridge.getFridge.handler.js";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/fridge")
export class FridgeController {
  @Post()
  @Representer(FridgeView, StatusCode.created)
  @OpenAPI({summary: "Create fridge"})
  async create(@Body() body: FridgeBody) {
    return createFridge(body);
  }

  @Get()
  @ListRepresenter(FridgeView)
  async getAllFridges(@Query() query: SearchQueryNumber) {
    return getAllFridges(query.search);
  }

  @Get("/:location")
  @Representer(FridgeView)
  async getFridge(@Param("location") location: number) {
    return getFridge(location);
  }
}
