import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  //   Put,
  //   Query,
  //   UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from '@modules/user/entities/user.entity';
// import { ValidationPipe } from '@common/pipes/validation.pipe';
// import { Roles } from '@common/decorators/roles.decorator';
// import { Role } from '@common/enums/role.enum';
// import { JwtGuard, RolesGuard } from '@common/guard';
// import { QueryParserPipe } from '@common/pipes/QueryParserPipe';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationPipe } from '@common/pipes/validation.pipe';

// @Roles(Role.ADMIN)
// @UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //   @Get()
  //   findAll(@Query(new QueryParserPipe('MANY', [])) findOption): Promise<User[]> {
  //     return this.userService.findAll(findOption);
  //   }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOneById(parseInt(id));
  }

  @Post()
  createOne(@Body(new ValidationPipe()) body: CreateUserDto) {
    return this.userService.createOne(body);
  }
}
