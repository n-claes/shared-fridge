import { getUser } from "./user.getUser.handler.js";
import { addProductToUser, getProductFromUser, removeProductFromUser } from "../user.utilities.js";

export const giftProductToUser = async (
  lastName: string, productName: string, otherUser: string
) => {
  const fromUser = await getUser(lastName)
  const toUser = await getUser(otherUser)
  const product = await getProductFromUser(fromUser, productName)
  await removeProductFromUser(fromUser, product)
  await addProductToUser(toUser, product)

  return toUser
}
