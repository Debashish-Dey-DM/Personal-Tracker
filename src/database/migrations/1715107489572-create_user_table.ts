import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1715107489572 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'username',
            type: 'varchar',
            // isUnique: true,
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            // isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'registered_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'remember_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'user_type',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'status',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: true,
            default: true,
          },
          {
            name: 'bearer_secret',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'refresh_secret',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
