import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/products/product.body.js";
import { Product } from "../../../entities/product.entity.js";
import { createProduct } from "../../products/handlers/product.create.handler.js";
import { getUser } from "./user.getUser.handler.js";
import { addProductToUser } from "../user.utilities.js";

export const buyProduct = async (body: ProductBody, userName: string) => {
  const em = RequestContext.getEntityManager();
  const user = await getUser(userName)
  const product = await em.findOne(Product, {
    name: body.name,
    belongsTo: user.lastName
  }) || await createProduct(body, user.lastName)
  await addProductToUser(user, product)
  return product
}
