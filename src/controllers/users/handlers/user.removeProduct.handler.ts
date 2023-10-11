import { RequestContext } from "@mikro-orm/core";
import { getProductFromUser } from "./user.getProduct.handler.js";
import { getUser } from "./user.getUser.handler.js";

export const removeProductFromUser = async (lastName: string, productName: string) => {
  const em = RequestContext.getEntityManager();
  const product = await getProductFromUser(lastName, productName);
  const user = await getUser(lastName);

  const idxToRemove = user.products.indexOf(product);
  user.products.splice(idxToRemove, 1);
  await em.persistAndFlush(user);
  return product;
}
