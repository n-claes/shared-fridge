import { getUser } from "../../users/handlers/user.getUser.handler.js";
import { deleteAllUserProducts } from "./product.deleteAllUserProducts.js";
import { addProduct } from "../../users/handlers/user.addProduct.handler.js";
import { ProductBody } from "../../../contracts/products/product.body.js";
import { getProduct } from "./product.getProduct.handler.js";
import { RequestContext } from "@mikro-orm/core";
import { getAllProducts } from "./product.getAllProducts.handler.js";

export const giftAllProductsToUser = async (
  lastName: string, otherUserLastName: string
) => {
  const em = RequestContext.getEntityManager();
  const fromUser = await getUser(lastName)
  const toUser = await getUser(otherUserLastName)
  const [products, __] = await getAllProducts(fromUser.lastName)

  await deleteAllUserProducts(fromUser.lastName)
  for (const p of products) {
    p.belongsTo = toUser.lastName
    await addProduct(p as ProductBody, toUser.lastName)
    await em.persistAndFlush(p)
  }
  await em.persistAndFlush(fromUser)
  await em.persistAndFlush(toUser)
  return toUser;
}
