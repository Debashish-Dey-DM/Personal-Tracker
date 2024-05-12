import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserFactory {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  username?: string;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  registered_at?: Date;

  @Column()
  remember_token?: string;

  @Column()
  user_type?: string;

  @Column()
  status?: string;

  // @Column()
  // tenant_identifier?: number;

  @Column()
  is_active?: boolean;

  @Column()
  created_by?: string;

  @Column()
  updated_by?: string;

  @Column()
  deleted_by?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  // relations
}
