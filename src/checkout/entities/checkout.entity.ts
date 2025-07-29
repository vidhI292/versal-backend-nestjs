import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity('checkout')
export class Checkout {
  @PrimaryGeneratedColumn({ name: 'checkout_id' })
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Cart, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ name: 'shipping_address', type: 'varchar', length: 255, nullable: true })
  shippingAddress: string;

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  paymentMethod: string;

  @Column({ name: 'card_details', type: 'varchar', length: 100, nullable: true })
  cardDetails?: string;

  @Column({ name: 'offer_code', type: 'varchar', length: 50, nullable: true })
  offerCode?: string;

  @OneToMany(() => Order, order => order.checkout)
orders: Order[];

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
