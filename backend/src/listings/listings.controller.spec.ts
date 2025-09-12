import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { ListingsService } from "./listings.service";
import { Listing } from "@prisma/client";
import { CreateListingDto } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";

@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findAll(): Promise<Listing[]> {
    return this.listingsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Listing | null> {
    return this.listingsService.findOne(BigInt(id));
  }

  @Post()
  create(@Body() data: CreateListingDto): Promise<Listing> {
    return this.listingsService.create(data);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() data: UpdateListingDto,
  ): Promise<Listing> {
    return this.listingsService.update(BigInt(id), data);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<Listing> {
    return this.listingsService.remove(BigInt(id));
  }
}
