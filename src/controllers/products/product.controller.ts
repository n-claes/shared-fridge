import { ListRepresenter, Query, Representer } from "@panenco/papi";
import { Get, JsonController, Param } from "routing-controllers";
import { ProductView } from "../../contracts/products/product.view.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { getAllProducts } from "./handlers/product.getAllProducts.handler.js";

@JsonController("/products")
export class ProductController {
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
}
