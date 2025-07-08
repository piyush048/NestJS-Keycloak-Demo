import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AquaLabController } from './aqua-lab.controller';
import { MarketingController } from './marketing-crm.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [ AquaLabController, MarketingController],
  providers: [],
})
export class ProtectedModule { }