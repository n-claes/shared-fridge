import { RequestContext } from "@mikro-orm/core";
import { User } from "../../entities/user.entity.js";
import { Product } from "../../entities/product.entity.js";


export const addProductToUser = async (user: User, product: Product) => {
    const em = RequestContext.getEntityManager();
    product.belongsTo = user.lastName;
    user.products.push(product);
    await em.persistAndFlush(user);
}

export const getProductFromUser = async (user: User, productName: string) => {
    const em = RequestContext.getEntityManager();
    return await em.findOneOrFail(
      Product, { name: productName, belongsTo: user.lastName }
    );
}

export const removeProductFromUser = async (user: User, product: Product) => {
    const em = RequestContext.getEntityManager();
    if (!user.products.find((p) => p.name === product.name)) {
      throw new Error("Product does not exist in user's products");
    }
    user.products = user.products.filter((p) => p.name !== product.name);
    await em.persistAndFlush(user);
}
