import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";

export const getAllProducts = async (search: string) => {
  const em = RequestContext.getEntityManager();
  return em.findAndCount(
		Product,
		search
			? {
				$or: [
          {name: {$ilike: `%${search}%`}},
          {belongsTo: {$ilike: `%${search}%`}}],
			}
			: {}
	);
}
