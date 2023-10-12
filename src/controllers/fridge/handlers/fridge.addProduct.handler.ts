import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";
import { Fridge } from "../../../entities/fridge.entity.js";

export const addProductToFridge = async (product: Product, fridge: Fridge) => {
  const em = RequestContext.getEntityManager();
  if (product.size > fridge.totalCapacity - fridge.currentCapacity) {
    throw new Error("Product does not fit in fridge");
  }
  fridge.products.push(product);
  fridge.currentCapacity += product.size;
  await em.flush();
}
