import { RequestContext } from "@mikro-orm/core"
import { getUser } from "../../users/handlers/user.getUser.handler.js";
import { deleteAllUserProducts } from "./product.deleteAllUserProducts.js";
import { addProduct } from "../../users/handlers/user.addProduct.handler.js";
import { ProductBody } from "../../../contracts/products/product.body.js";

export const giftAllProductsToUser = async (
  lastName: string, otherUserLastName: string
) => {
  const em = RequestContext.getEntityManager();

  const fromUser = await getUser(lastName)
  const toUser = await getUser(otherUserLastName)
  const products = await deleteAllUserProducts(fromUser.lastName)
  products.forEach((p) => {addProduct(p as ProductBody, toUser.lastName)})
  return products;
}
