import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Serialize } from 'src/interceptors/serialize.interceptor';

import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import path = require('path');

export const storage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/profileimages');
    },
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}.${extension}`);
    },
  }),
};

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = this.usersService.create(body.name, body.email);

    if (!user) {
      throw new BadRequestException('Unable to create user');
    }

    return user;
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return JSON.stringify({ imageUrl: file.filename });
  }
}
