import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Listing, Prisma } from "@prisma/client";
import { CreateListingDto } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateListingDto): Promise<Listing> {
    return this.prisma.listing.create({
      data: {
        ...data,
        category_id: data.category_id ? BigInt(data.category_id) : null,
      } as Prisma.ListingUncheckedCreateInput,
    });
  }

  async findAll(): Promise<Listing[]> {
    return this.prisma.listing.findMany();
  }

  async findOne(id: bigint): Promise<Listing | null> {
    return this.prisma.listing.findUnique({ where: { id } });
  }

  async update(id: bigint, data: UpdateListingDto): Promise<Listing> {
    return this.prisma.listing.update({
      where: { id },
      data: {
        ...data,
        category_id: data.category_id ? BigInt(data.category_id) : null,
      } as Prisma.ListingUncheckedUpdateInput,
    });
  }

  async remove(id: bigint): Promise<Listing> {
    return this.prisma.listing.delete({ where: { id } });
  }
}
