import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: number;

  @Column({nullable:true})
  name: string;

  @Column({nullable:true})
  image: string;

  @Column('decimal', { precision: 10, scale: 2 ,nullable:true})
  price: number;

  @Column({ type: 'text' ,nullable:true})
  description: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'int', default: 0 ,nullable:true})
  quantity: number;

  @ManyToOne(() => Category, category => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, user => user.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
