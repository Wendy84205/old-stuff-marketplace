import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateListingDto) {
    return this.prisma.listings.create({ data });
  }

  findAll() {
    return this.prisma.listings.findMany({
      include: { listing_images: true, category: true },
    });
  }

  findOne(id: number) {
    return this.prisma.listings.findUnique({
      where: { id },
      include: { listing_images: true, category: true },
    });
  }

  update(id: number, data: UpdateListingDto) {
    return this.prisma.listings.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.listings.delete({ where: { id } });
  }
}
