import { RequestContext } from "@mikro-orm/core";
import { getUser } from "../../users/handlers/user.getUser.handler.js"
import { getFridge } from "./fridge.getFridge.handler.js"
import { deleteAllUserProductsFromFridge } from "./fridge.deleteAllUserProductsFromFridge.handler.js";

export const giftAllProductsFromFridgeToUser = async (
  lastName: string, location: number, otherUserLastName: string
) => {
  const em = RequestContext.getEntityManager();
  const fromUser = await getUser(lastName)
  const toUser = await getUser(otherUserLastName)
  const fridge = await getFridge(location)

  const products = await deleteAllUserProductsFromFridge(fromUser.lastName, location)
  products.forEach((p) => {p.belongsTo = toUser.lastName})
  toUser.products.push(...products)
  await em.persistAndFlush(toUser)

  return fridge;
}
