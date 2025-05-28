import { UsersRepository } from "~/repositories/user_repository";
import type { LoginDTO } from "~/services/dtos/requests/login_dto";
import type { AuthenticateResponse } from "~/services/dtos/responses/authenticate_response";
import type { RegisterDTO } from "~/services/dtos/requests/register_dto";
import type { User } from "~/entities/user";
import type { UpdateProfileDTO } from "~/services/dtos/requests/update_profile_dto";

export class UserService {
    private userRepository: UsersRepository;

    constructor() {
        this.userRepository = new UsersRepository();
    }

    async get() : Promise<User[]> {
        return this.userRepository.get();
    }

  async getByUsername(username: string): Promise<User> {
    return this.userRepository.getByUsername(username);
  }

  async updateProfile(data: UpdateProfileDTO): Promise<User> {
    return this.userRepository.updateProfile(data);
  }

    async login(data: LoginDTO): Promise<AuthenticateResponse> {
        const response = await this.userRepository.login(data);

        sessionStorage.setItem("username", response.username);
        sessionStorage.setItem("role", response.role);

        return response;
    }

    async register(data: RegisterDTO): Promise<AuthenticateResponse> {
        const response = await this.userRepository.register(data);

        sessionStorage.setItem("username", response.username);
        sessionStorage.setItem("role", response.role);

        return response;
    }

    async logout() {
        await this.userRepository.logout();

        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role");
    }

    async toggleBan(userId: number, currentBanStatus: boolean) {
        return await this.userRepository.update({
            id: userId,
            banned: !currentBanStatus,
        });
    }
}
