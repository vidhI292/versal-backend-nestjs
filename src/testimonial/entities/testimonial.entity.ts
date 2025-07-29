import {Entity, PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,CreateDateColumn,UpdateDateColumn} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('testimonial')
export class Testimonial {
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => User, (user) => user.testimonials, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  person_image: string;

  @Column({ type: 'varchar', length: 100 })
  person_name: string;

  @Column({ type: 'int' })
  review: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
