import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {User} from "./interfaces/user.interface";
import {UsersService} from "./users.service";
import {AddUserDto} from "./dto/add-user.dto";

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async addTemp(@Body() addTempDto: AddUserDto): Promise<User> {
        return this.usersService.addTemp(addTempDto);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<User> {
        console.log(id)
        return this.usersService.findById(id);
    }

}
