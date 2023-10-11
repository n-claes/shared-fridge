import { getUser } from "../../users/handlers/user.getUser.handler.js";
import { getFridge } from "./fridge.getFridge.handler.js";

export const getUserProductFromFridge = async (
  userName: string, productName: string, location: number
) => {
  const user = await getUser(userName)
  const fridge = await getFridge(location)
  const fridgeProduct = fridge.products.find(
    (p) => p.name === productName && p.belongsTo === user.lastName
  )
  if (!fridgeProduct) {
    throw new Error("Product does not exist in fridge");
  }
  return fridgeProduct;
}
