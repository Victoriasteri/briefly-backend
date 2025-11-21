import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export interface CreateUserDto {
    supabaseUserId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    metadata?: Record<string, any>;
}
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findBySupabaseUserId(supabaseUserId: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    remove(id: string): Promise<void>;
}
