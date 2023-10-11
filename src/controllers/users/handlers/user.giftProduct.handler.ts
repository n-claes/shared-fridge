import { ProductBody } from "../../../contracts/products/product.body.js";
import { addProduct } from "./user.addProduct.handler.js";
import { getUser } from "./user.getUser.handler.js";
import { removeProductFromUser } from "./user.removeProduct.handler.js";

export const giftProductToUser = async (
  lastName: string, productName: string, otherUser: string
) => {
  const fromUser = await getUser(lastName)
  const toUser = await getUser(otherUser)

  const product = await removeProductFromUser(fromUser.lastName, productName)
  await addProduct(product as ProductBody, toUser.lastName)
  return toUser
}
