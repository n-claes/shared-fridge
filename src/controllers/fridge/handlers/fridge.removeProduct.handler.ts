import { RequestContext } from "@mikro-orm/core";
import { getUserProductFromFridge } from "./fridge.getProduct.handler.js";
import { getFridge } from "./fridge.getFridge.handler.js";

export const removeProductFromFridge = async (
  userName: string, productName: string, location: number
) => {
  const em = RequestContext.getEntityManager()
  const product = await getUserProductFromFridge(userName, productName, location)
  const fridge = await getFridge(location)

  const idxToRemove = fridge.products.findIndex((p) => p.name === product.name)
  fridge.products.splice(idxToRemove, 1);
  fridge.currentCapacity -= product.size;
  await em.persistAndFlush(fridge);
  return product
}
