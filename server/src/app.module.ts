import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "sqlite",
    database: "chat",
    synchronize: true,
    entities: [
      "dist/**/*.entity.{js, ts}"
    ]
  }), UserModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
