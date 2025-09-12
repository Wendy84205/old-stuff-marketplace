export class UpdateListingDto {
  title?: string;
  description?: string | null;
  category_id?: number | null;
  condition?: string | null;
  price?: number;
  currency?: string;
}
