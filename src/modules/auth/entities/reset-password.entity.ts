import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('reset_passwords')
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column()
  expired_at: Date;
}
