import { RequestContext } from "@mikro-orm/core";
import { getUser } from "../../users/handlers/user.getUser.handler.js"
import { getFridge } from "./fridge.getFridge.handler.js"
import { deleteAllUserProductsFromFridge } from "./fridge.deleteAllUserProductsFromFridge.handler.js";
import { Product } from "../../../entities/product.entity.js";

export const giftAllProductsFromFridgeToUser = async (
  lastName: string, location: number, otherUserLastName: string
) => {
  const em = RequestContext.getEntityManager();
  const fromUser = await getUser(lastName)
  const toUser = await getUser(otherUserLastName)
  const fridge = await getFridge(location)

  const tmpProducts = await deleteAllUserProductsFromFridge(fromUser.lastName, location)
  // update db
  for (const product of tmpProducts) {
    const dbProduct = await em.findOneOrFail(
      Product, {name: product.name, belongsTo: fromUser.lastName}
    )
    dbProduct.belongsTo = toUser.lastName
    dbProduct.inFridge = false
    toUser.products.push(dbProduct)
  }
  await em.flush()
  return fridge;
}
