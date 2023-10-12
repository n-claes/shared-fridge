import { getFridge } from "../../fridge/handlers/fridge.getFridge.handler.js";
import { getProductFromUser } from "./user.getProduct.handler.js";
import { removeProductFromUser } from "./user.removeProduct.handler.js";
import { addProductToFridge } from "../../fridge/handlers/fridge.addProduct.handler.js";
import { RequestContext } from "@mikro-orm/core";
import { getProduct } from "../../products/handlers/product.getProduct.handler.js";

export const moveProductToFridge = async (
  lastName: string, productName: string, location: number
) => {
  const em = RequestContext.getEntityManager();
  const fridge = await getFridge(location)
  const product = await getProduct(productName, lastName)
  await removeProductFromUser(lastName, product.name)
  await addProductToFridge(product, fridge)
  product.inFridge = true;
  await em.persistAndFlush(product);
  return fridge
}
