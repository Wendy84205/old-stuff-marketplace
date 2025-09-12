import { Module } from "@nestjs/common";
import { ListingsController } from "./listings.controller";
import { ListingsService } from "./listings.service";
import { PrismaService } from "../prisma/prisma.service"; // ✅ phải có file này

@Module({
  controllers: [ListingsController],
  providers: [ListingsService, PrismaService],
})
export class ListingsModule {}
