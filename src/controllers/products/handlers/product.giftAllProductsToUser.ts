import { getUser } from "../../users/handlers/user.getUser.handler.js";
import { deleteAllUserProducts } from "./product.deleteAllUserProducts.js";
import { addProduct } from "../../users/handlers/user.addProduct.handler.js";
import { ProductBody } from "../../../contracts/products/product.body.js";

export const giftAllProductsToUser = async (
  lastName: string, otherUserLastName: string
) => {
  const fromUser = await getUser(lastName)
  const toUser = await getUser(otherUserLastName)
  const products = await deleteAllUserProducts(fromUser.lastName)
  for (const p of products) {
    await addProduct(p as ProductBody, toUser.lastName)
  }
  return products;
}
