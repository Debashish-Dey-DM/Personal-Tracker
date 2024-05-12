import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto, ChangePasswordDto, ResetPasswordDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@modules/user/user.service';
// import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { RefreshToken } from './interfaces';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPassword } from './entities/reset-password.entity';
// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private config: ConfigService,
    // private mailService: MailerService,
    private dataSource: DataSource,
    @InjectRepository(ResetPassword)
    private resetPasswordRepository: Repository<ResetPassword>,
  ) {}

  async signIn(dto: AuthDto) {
    const user = await this.checkUserByEmail(dto.email);
    await this.validateUser(user, dto.password);
    const { access_token, refresh_token, expires_in } =
      await this.signTokens(user);
    return {
      access_token,
      refresh_token,
      expires_in,
      // user: await this.userService.findOneById(user.id)
    };
  }

  async refreshToken(dto: RefreshToken) {
    const user = await this.userService.findOneById(
      parseInt(dto.user_id.toString()),
    );
    if (!user) throw new ForbiddenException();
    const { access_token, refresh_token, expires_in } =
      await this.signTokens(user);
    return {
      access_token,
      refresh_token,
      expires_in,
    };
  }

  // async sendResetPasswordEmail(dto: ForgotPasswordDto) {
  //   const user = await this.checkUserByEmail(dto.email);
  //   if (!user) throw new NotFoundException();

  //   const tokenExists = await this.resetPasswordRepository.findOne({
  //     where: {
  //       email: dto.email,
  //     },
  //   });

  //   if (tokenExists) {
  //     await this.resetPasswordRepository.delete({
  //       email: dto.email,
  //     });
  //   }

  //   const token =
  //     Math.random().toString(36).substring(2, 16) +
  //     Math.random().toString(36).substring(2, 15);

  //   const resetPassword = new ResetPassword();
  //   resetPassword.email = dto.email;
  //   resetPassword.token = token;
  //   resetPassword.expired_at = new Date(Date.now() + 3600000);
  //   await this.resetPasswordRepository.save(resetPassword);

  //   const link = `${process.env.FRONTEND_URL}/auth/new-password?email=${dto.email}&token=${token}`;

  //   await this.mailService.sendMail({
  //     to: dto.email,
  //     from: 'shams@deepchainlabs.com',
  //     subject: 'Deepchain Labs Password Recovery',
  //     html: `
  //     <html>
  //     <body style="font-family: Arial, sans-serif">
  //       <table
  //         style="
  //           background-color: #f5f5f5;
  //           padding: 30px;
  //           margin: 0 auto;
  //           width: 600px;
  //           text-align: center;
  //         "
  //       >
  //         <tr>
  //           <td>
  //             <p
  //               style="
  //                 text-align: center;
  //                 font-family: Arial, sans-serif;
  //                 font-size: 16px;
  //                 font-weight: bold;
  //               "
  //             >
  //               Deepchian Labs
  //             </p>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>
  //             <h1
  //               style="
  //                 color: #333;
  //                 text-align: center;
  //                 margin-bottom: 10px;
  //                 margin-top: 35px;
  //               "
  //             >
  //               Password Reset
  //             </h1>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>
  //             <p style="padding: 0 50px; text-align: center">
  //               If you've lost your password or wish to reset it,<br />
  //               use the link below to get started.
  //             </p>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>
  //             <table
  //               style="
  //                 margin: 30px auto;
  //                 background-color: #2B79D3;
  //                 border-radius: 4px;
  //                 display: inline-table;
  //               "
  //             >
  //               <tr>
  //                 <td>
  //                   <a
  //                     style="
  //                       display: inline-block;
  //                       color: #fff;
  //                       text-decoration: none;
  //                       text-align: center;
  //                       padding: 10px 20px;
  //                       margin: 0;
  //                       height: 20px;
  //                     "
  //                     href="${link}"
  //                   >
  //                     Reset Password
  //                   </p>
  //                 </td>
  //               </tr>
  //             </table>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>
  //             <p style="color: #666; text-align: center; font-size: small">
  //               If you did not request a password reset, you can safely ignore this
  //               email. Only a person with access to your email can reset your
  //               account password.
  //             </p>
  //           </td>
  //         </tr>
  //       </table>
  //     </body>
  //   </html>
  //   `,
  //   });

  //   return true;
  // }

  async setNewPassword(dto: ResetPasswordDto) {
    const data = await this.resetPasswordRepository.findOne({
      where: {
        email: dto.email,
      },
    });
    if (!data) throw new NotFoundException();
    if (data.token !== dto.token) throw new ForbiddenException();
    if (data.expired_at < new Date()) throw new ForbiddenException();
    const user = await this.checkUserByEmail(dto.email);
    if (!user) throw new NotFoundException();
    user.password = await argon.hash(dto.password);
    await this.userService.updateOne(user);
    await this.resetPasswordRepository.delete(data.id);
    return true;
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.checkUserByEmail(dto.email);
    await this.validateUser(user, dto.password);
    user.password = await argon.hash(dto.new_password);
    return this.userService.updateOne(user);
  }

  /**
   * sign tokens for user
   * @date 2022-07-27
   * @param {any} user:User
   * @returns {Promise<object>}
   */
  async signTokens(user: User): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const expires_in = Date.now() + 365 * 24 * 60 * 60;
    //define payloads
    const accessPayload = {
      user_id: user.id,
      email: user.email,
      // roles: [user.role],
    };
    const refreshPayload = {
      user_id: user.id,
    };
    const bearerSecret = this.config.get('JWT_SECRET');
    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');

    //generate a bearer token
    const accessToken = await this.jwt.signAsync(accessPayload, {
      expiresIn: '1day',
      secret: bearerSecret,
    });

    //generate a refresh token
    const refreshToken = await this.jwt.signAsync(refreshPayload, {
      expiresIn: '60d',
      secret: refreshSecret,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in,
    };
  }

  /**
   * get user by email if exists
   * @date 2022-07-19
   * @param {string} email:string
   * @returns {User}
   */
  async checkUserByEmail(email: string) {
    // find the user by email
    const user = await this.userService.findOneByEmail(email);
    // if user does not exist throw exception
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * validate user against password
   * @date 2022-07-19
   * @param {any} user:UserDto
   * @param {any} password:string
   * @returns {boolean}
   */
  async validateUser(user: any, password: string) {
    // compare password
    const passwordMatches = await argon.verify(user.password, password);
    console.log('test');
    // if password incorrect throw exception
    if (!passwordMatches)
      throw new UnauthorizedException('Incorrect Credentials');
    return true;
  }
}
