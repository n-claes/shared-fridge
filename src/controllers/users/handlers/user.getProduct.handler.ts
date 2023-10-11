import { getUser } from "./user.getUser.handler.js";

export const getProductFromUser = async (lastName: string, productName: string) => {
  const user = await getUser(lastName);
  const product = user.products.find((p) => p.name === productName);
  if (!product) {
    throw new Error("Product does not exist in user's products");
  }
  return product;
}
