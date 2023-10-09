import { Dictionary } from '@mikro-orm/core';
import { NotFound } from '@panenco/papi';

export const noEntityFoundError = function (
  entityName: string, where: Dictionary<any>
): Error {
	throw new NotFound(`entityNotFound`, `${entityName} not found`);
};
