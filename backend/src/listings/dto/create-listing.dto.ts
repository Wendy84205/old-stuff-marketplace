export class CreateListingDto {
  seller_id: string;
  title: string;
  description?: string;
  category_id?: number;
  condition?: string;
  price: number;
  currency: string;
}
