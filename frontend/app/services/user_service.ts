import {UsersRepository} from "~/repositories/user_repository";
import type {LoginDTO} from "~/services/dtos/requests/login_dto";
import type {AuthenticateResponse} from "~/services/dtos/responses/authenticate_response";
import type {RegisterDTO} from "~/services/dtos/requests/register_dto";

export class UserService {
    private userRepository: UsersRepository;

    constructor() {
        this.userRepository = new UsersRepository();
    }

    async login(data: LoginDTO): Promise<AuthenticateResponse> {
        return this.userRepository.login(data);
    }

    async register(data: RegisterDTO): Promise<AuthenticateResponse> {
        return this.userRepository.register(data);
    }

    async logout() {
        await this.userRepository.logout();
    }
}