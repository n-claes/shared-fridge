import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/product.body.js";
import { Product } from "../../../entities/product.entity.js";
import { getFridge } from "../../fridge/handlers/fridge.getFridge.handler.js";
import { getUser } from "./user.getUser.handler.js";
import { createProduct } from "../../products/handlers/product.create.handler.js";

export const addProduct = async (
  lastName: string, body: ProductBody, location: number
) => {
  const em = RequestContext.getEntityManager();
  // fridge and user must exist
  const fridge = await getFridge(location)
  const user = await getUser(lastName)
  // find product based on product name and lastName
  const product = await em.findOne(Product, {
    name: body.name,
    belongsTo: lastName
  }) || await createProduct(body, user.lastName)
  // check if product fits in fridge
  if (product.size > fridge.totalCapacity - fridge.currentCapacity) {
    throw new Error("Product does not fit in fridge")
  }
  // add product to fridge and store in db using json
  fridge.products.push(product)
  fridge.currentCapacity += product.size
  await em.persistAndFlush(fridge)
}
