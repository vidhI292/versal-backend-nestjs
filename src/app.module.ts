import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { SliderModule } from './slider/slider.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import googleOauthConfig from './auth/config/google-oauth.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,
      load: [googleOauthConfig],
     }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),


    ProductModule,
    UserModule,
    ContactModule,
    AuthModule,
    CategoryModule,
    TestimonialModule,
    SliderModule,
    OrderModule,
    CartModule,
    CheckoutModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
