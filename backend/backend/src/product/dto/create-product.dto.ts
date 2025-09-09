export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  userId: number; // lưu ý: number vì Prisma schema dùng Int
}
