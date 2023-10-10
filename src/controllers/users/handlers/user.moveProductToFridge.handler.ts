import { RequestContext } from "@mikro-orm/core";
import { getFridge } from "../../fridge/handlers/fridge.getFridge.handler.js";
import { getUser } from "./user.getUser.handler.js";
import { getProductFromUser, removeProductFromUser } from "../user.utilities.js";

export const moveProductToFridge = async (
  lastName: string, productName: string, location: number
) => {
  const em = RequestContext.getEntityManager();
  const fridge = await getFridge(location)
  const user = await getUser(lastName)

  const product = await getProductFromUser(user, productName)
  await removeProductFromUser(user, product)

  // check if product fits in fridge
  if (product.size > fridge.totalCapacity - fridge.currentCapacity) {
    throw new Error("Product does not fit in fridge")
  }
  // add product to fridge and store in db using json
  fridge.products.push(product)
  fridge.currentCapacity += product.size
  await em.persistAndFlush(fridge)
  return fridge
}
