import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username?: string;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  registered_at?: Date;

  @Column()
  remember_token?: string;

  @Column()
  user_type?: string;

  @Column()
  status?: string;

  @Column()
  is_active?: boolean;

  @Column()
  bearer_secret?: string;

  @Column()
  refresh_secret?: string;

  @Column()
  created_by?: string;

  @Column()
  updated_by?: string;

  @Column()
  deleted_by?: string;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  created_at?: Date;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  updated_at?: Date;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  deleted_at?: Date;
}
