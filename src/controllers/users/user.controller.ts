import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { UserBody } from "../../contracts/users/user.body.js";
import { create } from "./handlers/user.create.handler.js";
import { Delete, Get, JsonController, Param, Post } from "routing-controllers";
import { UserView } from "../../contracts/users/user.view.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { getAllUsers } from "./handlers/user.getAllUsers.handler.js";
import { getUser } from "./handlers/user.getUser.handler.js";
import { deleteByName } from "./handlers/user.delete.handler.js";
import { ProductBody } from "../../contracts/products/product.body.js";
import { moveProductToFridge } from "./handlers/user.moveProductToFridge.handler.js";
import { ProductView } from "../../contracts/products/product.view.js";
import { OpenAPI } from "routing-controllers-openapi";
import { addProduct } from "./handlers/user.addProduct.handler.js";
import { FridgeView } from "../../contracts/fridge/fridge.view.js";
import { giftProductToUser } from "./handlers/user.giftProduct.handler.js";
import { removeProductFromFridge } from "../fridge/handlers/fridge.removeProduct.handler.js";
import { getProductFromUser } from "./handlers/user.getProduct.handler.js";

@JsonController("/users")
export class UserController {
  @Post()
  @Representer(UserView, StatusCode.created)
  @OpenAPI({summary: "Create user"})
  async create(@Body() body: UserBody) {
    return create(body);
  }

  @Post("/:lastName/buy")
  @Representer(ProductView, StatusCode.ok)
  async buyProduct(@Param("lastName") lastName: string, @Body() body: ProductBody) {
    return addProduct(body, lastName)
  }

  @Post("/:lastName/move/:productName/:fridgeLocation")
  @Representer(FridgeView, StatusCode.ok)
  async moveProductToFridge(
    @Param("lastName") lastName: string,
    @Param("fridgeLocation") fridgeLocation: number,
    @Param("productName") productName: string,
  ) {
    return moveProductToFridge(lastName, productName, fridgeLocation)
  };

  @Post("/:lastName/gift/:productName/:otherUserLastName")
  @Representer(UserView, StatusCode.ok)
  async giftProductToUser(
    @Param("lastName") lastName: string,
    @Param("productName") productName: string,
    @Param("otherUserLastName") otherUserLastName: string,
  ) {
    return giftProductToUser(lastName, productName, otherUserLastName)
  }

  @Get()
  @ListRepresenter(UserView)
  async getAllUsers(@Query() query: SearchQuery) {
    return getAllUsers(query.search);
  }

  @Get("/:lastName")
  @Representer(UserView)
  async getUser(@Param("lastName") lastName: string) {
    return getUser(lastName);
  }

  @Get("/:lastname/:productName")
  @Representer(ProductView)
  async getUserProduct(
    @Param("lastName") lastName: string, @Param("productName") productName: string
  ) {
    return getProductFromUser(lastName, productName);
  }

  @Delete("/:lastName")
  @Representer(null)
  async deleteUser(@Param("lastName") lastName: string) {
    return deleteByName(lastName);
  }

  @Delete("/:lastName/remove/:productName/:fridgeLocation")
  @Representer(null)
  async removeProductFromFridge(
    @Param("lastName") lastName: string,
    @Param("fridgeLocation") fridgeLocation: number,
    @Param("productName") productName: string,
  ) {
    return removeProductFromFridge(lastName, productName, fridgeLocation)
  }
}
