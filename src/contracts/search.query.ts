// search.query.ts

import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

@Exclude()
export class SearchQuery {
  @Expose()
  @IsString()
  @IsOptional()
  public search?: string;
}

@Exclude()
export class SearchQueryNumber {
  @Expose()
  @IsString()
  @IsOptional()
  public search?: number;
}
