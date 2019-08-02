import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {User} from './interfaces/user.interface';
import {AddUserDto} from "./dto/add-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async addTemp(addTempDto: AddUserDto): Promise<User> {
        const addedUser = new this.userModel(addTempDto);
        return await addedUser.save();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findById(id: string): Promise<User> {
        return await this.userModel.find({_id: id});
    }
}
