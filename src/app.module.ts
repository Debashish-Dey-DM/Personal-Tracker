import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDatabaseProviderModule } from '@providers/database/postgress/provider.module';
import { AuthModule } from '@modules/auth/auth.module';
// import { DataSource } from 'typeorm';
@Module({
  imports: [
    PostgresDatabaseProviderModule,
    // TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(private dataSource: DataSource) {}
}
