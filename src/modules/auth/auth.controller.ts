import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthDto, ResetPasswordDto } from './dto';
import { ValidationPipe } from '@common/pipes/validation.pipe';
import { RefreshToken } from './interfaces';
import { RefreshJwtGuard } from '@common/guard';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body(new ValidationPipe()) dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @UseGuards(RefreshJwtGuard)
  refreshToken(@Req() req: Request & { user: RefreshToken }) {
    return this.authService.refreshToken(req.user);
  }

  //Sent a link to user email for reset password
  // @HttpCode(HttpStatus.OK)
  // @Post('forgot-password')
  // forgotPassword(@Body(new ValidationPipe()) dto: ForgotPasswordDto) {
  //   return this.authService.sendResetPasswordEmail(dto);
  // }

  //Set new password
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body(new ValidationPipe()) dto: ResetPasswordDto) {
    return this.authService.setNewPassword(dto);
  }
}
