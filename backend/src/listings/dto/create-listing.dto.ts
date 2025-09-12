// create-listing.dto.ts
export class CreateListingDto {
  seller_id: string;
  title: string;
  description?: string | null;
  category_id?: bigint | null;
  condition?: string | null;
  price: number;
  currency: string;
}
