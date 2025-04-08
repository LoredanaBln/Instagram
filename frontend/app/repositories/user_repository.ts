import axios from "axios";
import {ENDPOINTS} from "~/config/endpoint";
import type {AuthenticateResponse} from "~/services/dtos/responses/authenticate_response";
import type {LoginDTO} from "~/services/dtos/requests/login_dto";
import {api} from "~/config/api";
import type {RegisterDTO} from "~/services/dtos/requests/register_dto";

export class UsersRepository {
    async login(data: LoginDTO): Promise<AuthenticateResponse> {
        try {
            const response = await api.post<AuthenticateResponse>('/api/users/login', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to login the user');
        }
    }

    async register(data: RegisterDTO): Promise<AuthenticateResponse> {
        try {
            console.log(data);
            const response = await api.post<AuthenticateResponse>('/api/users', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to register the user');
        }
    }
    async logout() {
        try {
            const response = await api.post<AuthenticateResponse>('/api/users/logout', null, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
            });

        } catch (error) {
            console.error(error);
            throw new Error('Failed to register the user');
        }
    }

}
