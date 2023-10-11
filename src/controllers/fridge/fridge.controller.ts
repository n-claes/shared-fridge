import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { Delete, Get, JsonController, Param, Post } from "routing-controllers";
import { FridgeView } from "../../contracts/fridge/fridge.view.js";
import { FridgeBody } from "../../contracts/fridge/fridge.body.js";
import { createFridge } from "./handlers/fridge.create.handler.js";
import { SearchQueryNumber } from "../../contracts/search.query.js";
import { getAllFridges } from "./handlers/fridge.getAllFridges.handler.js";
import { getFridge } from "./handlers/fridge.getFridge.handler.js";
import { OpenAPI } from "routing-controllers-openapi";
import { getProductsFromFridge as getProductsFromFridge } from "./handlers/fridge.getProductsFromFridge.handler.js";
import { giftAllProductsFromFridgeToUser } from "./handlers/fridge.giftAllProductsFromFridgeToUser.handler.js";
import { deleteAllUserProductsFromFridge } from "./handlers/fridge.deleteAllUserProductsFromFridge.handler.js";
import { removeProductFromFridge } from "./handlers/fridge.removeProductFromFridge.handler.js";

@JsonController("/fridge")
export class FridgeController {
  @Post()
  @Representer(FridgeView, StatusCode.created)
  @OpenAPI({summary: "Create fridge"})
  async create(@Body() body: FridgeBody) {
    return createFridge(body);
  }

  @Post("/:location/:lastname/gift/:otherUserLastName/")
  @Representer(FridgeView, StatusCode.ok)
  async giftAllProductsFromFridgeToUser(
    @Param("location") location: number,
    @Param("lastname") lastName: string,
    @Param("otherUserLastName") otherUserLastName: string,
  ) {
    return giftAllProductsFromFridgeToUser(lastName, location, otherUserLastName);
  }

  @Get()
  @ListRepresenter(FridgeView)
  async getAllFridges(@Query() query: SearchQueryNumber) {
    return getAllFridges(query.search);
  }

  @Get("/:location")
  @Representer(FridgeView, StatusCode.ok)
  async getFridge(@Param("location") location: number) {
    return getFridge(location);
  }

  @Get("/:location/:lastName")
  async getUserProductsFromFridge(
    @Param("location") location: number, @Param("lastName") lastName: string
  ) {
    return getProductsFromFridge(location, lastName);
  }

  @Delete("/:location/:lastName/remove/:productName")
  @Representer(null)
  async removeProductFromFridge(
    @Param("lastName") lastName: string,
    @Param("fridgeLocation") fridgeLocation: number,
    @Param("productName") productName: string,
  ) {
    return removeProductFromFridge(lastName, productName, fridgeLocation)
  }

  @Delete("/:location/:lastName")
  @Representer(null)
  async deleteAllUserProductsFromFridge(
    @Param("location") location: number, @Param("lastName") lastName: string
  ) {
    return deleteAllUserProductsFromFridge(lastName, location);
  }
}
