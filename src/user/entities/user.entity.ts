import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Contact } from 'src/contact/entities/contact.entity';
import { Order } from 'src/order/entities/order.entity';
import { Testimonial } from 'src/testimonial/entities/testimonial.entity';
import { Role } from 'src/enums/User-Role.enum';
import { Slider } from 'src/slider/entities/slider.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];


  @OneToMany(() => Product, product => product.user)
  products: Product[];

  @OneToMany(() => Testimonial, (testimonial) => testimonial.user)
  testimonials: Testimonial[];

  @OneToMany(() => Slider, (slider) => slider.user)
  sliders: Slider[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

@Column({ nullable: true })
  picture: string;

  @Column({ default: 'local' })
  provider: string;

}
