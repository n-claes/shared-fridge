import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Product } from '../../entities/product.entity.js';

@Exclude()
export class UserView {
	@Expose()
	@IsString()
	public firstName: string;

	@Expose()
	@IsString()
	public lastName: string;

	@Expose()
	@IsEmail()
	public email: string;

	@Expose()
	public products: Product[];
}
