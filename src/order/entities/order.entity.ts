import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Checkout } from 'src/checkout/entities/checkout.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  checkout_id: number;

  @Column({ nullable: true })
  user_id: number; // Optional if you don't need direct access

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Checkout, checkout => checkout.orders)
  @JoinColumn({ name: 'checkout_id' })
  checkout: Checkout;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, nullable: true })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, nullable: true })
  delivery_fee: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
