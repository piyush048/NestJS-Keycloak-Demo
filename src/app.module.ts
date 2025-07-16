import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProtectedModule } from './protectedRoutes/protected.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProtectedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
