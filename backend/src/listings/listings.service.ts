import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Listing } from "@prisma/client";
import { CreateListingDto } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateListingDto): Promise<Listing> {
    return this.prisma.listing.create({
      data: {
        ...data,
        status: "active", // default
        category_id: data.category_id ? BigInt(data.category_id) : null,
      } as Prisma.ListingUncheckedCreateInput,
    });
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

  async findAll(): Promise<Listing[]> {
    return await this.prisma.listing.findMany();
  }

  async findOne(id: bigint): Promise<Listing | null> {
    return await this.prisma.listing.findUnique({ where: { id } });
  }

  async remove(id: bigint): Promise<Listing> {
    return await this.prisma.listing.delete({ where: { id } });
  }
}
