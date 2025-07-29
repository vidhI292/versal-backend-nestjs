import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';
import { Slider } from './entities/slider.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slider,User])],
  controllers: [SliderController],
  providers: [SliderService],
  exports: [SliderService]
})
export class SliderModule {}
