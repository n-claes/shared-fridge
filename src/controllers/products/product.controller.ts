import { ListRepresenter, Query, Representer } from "@panenco/papi";
import { Delete, Get, JsonController, Param, Post } from "routing-controllers";
import { ProductView } from "../../contracts/products/product.view.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { getAllProducts } from "./handlers/product.getAllProducts.handler.js";
import { giftAllProductsToUser } from "./handlers/product.giftAllProductsToUser.js";
import { deleteAllUserProducts } from "./handlers/product.deleteAllUserProducts.js";

@JsonController("/products")
export class ProductController {
  @Post("/:lastName/gift/:otherUserLastName")
  async giftAllProductsToUser(
    @Param("lastName") lastName: string,
    @Param("otherUserLastName") otherUserLastName: string,
  ) {
    return giftAllProductsToUser(lastName, otherUserLastName)
  }

  @Get()
  @ListRepresenter(ProductView)
  async getAllProducts(@Query() query: SearchQuery) {
    return getAllProducts(query.search)
  }

  @Get("/:lastName")
  @ListRepresenter(ProductView)
  async getAllUserProducts(@Param("lastName") lastName: string) {
    return getAllProducts(lastName)
  }

  @Delete("/:lastName")
  @Representer(null)
  async deleteAllUserProducts(@Param("lastName") lastName: string) {
    return deleteAllUserProducts(lastName)
  }
}
