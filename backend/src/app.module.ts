import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ListingsModule } from "./listings/listing.module";
@Module({
  imports: [PrismaModule, UserModule, ListingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
