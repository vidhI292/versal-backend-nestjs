import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('contact')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true })
  first_name: string;

  @Column({nullable: true })
  last_name: string;

  @Column({nullable: true })
  email: string;

  @Column({nullable: true })
  phone: string;

  @Column({nullable: true })
  subject: string;

  @Column({nullable: true })
  message: string;

  @CreateDateColumn()
  created_at: Date;

@UpdateDateColumn()
  updated_at: Date;


  @ManyToOne(() => User, (user) => user.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

}


