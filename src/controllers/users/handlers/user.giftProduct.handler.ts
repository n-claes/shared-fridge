import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/products/product.body.js";
import { getProduct } from "../../products/handlers/product.getProduct.handler.js";
import { addProduct } from "./user.addProduct.handler.js";
import { getUser } from "./user.getUser.handler.js";
import { removeProductFromUser } from "./user.removeProduct.handler.js";

export const giftProductToUser = async (
  lastName: string, productName: string, otherUser: string
) => {
  const em = RequestContext.getEntityManager();
  const fromUser = await getUser(lastName)
  const toUser = await getUser(otherUser)
  const product = await getProduct(productName, fromUser.lastName)

  await removeProductFromUser(fromUser.lastName, product.name)
  await addProduct(product as ProductBody, toUser.lastName)
  product.belongsTo = toUser.lastName
  await em.persistAndFlush(product)
  return toUser
}
