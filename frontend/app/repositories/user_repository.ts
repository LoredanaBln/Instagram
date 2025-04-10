import {ENDPOINTS} from "~/config/endpoint";
import type {AuthenticateResponse} from "~/services/dtos/responses/authenticate_response";
import type {LoginDTO} from "~/services/dtos/requests/login_dto";
import {api} from "~/config/api";
import type {RegisterDTO} from "~/services/dtos/requests/register_dto";
import type {User} from "~/entities/user";

export class UsersRepository {
    async login(data: LoginDTO): Promise<AuthenticateResponse> {
        try {
            const response = await api.post<AuthenticateResponse>('/api/users/login', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
            })


            return response.data;
        } catch (error) {
            // @ts-ignore
            if ((error as AxiosError).response.status === 403) {
                localStorage.setItem("isBanned", "1");
                window.location.reload();
            }
            throw new Error('Failed to login the user');
        }
    }

    async get(): Promise<User[]> {
        try {
            const response = await api.get<User[]>(ENDPOINTS.USERS);

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch posts');
        }
    }

    async register(data: RegisterDTO): Promise<AuthenticateResponse> {
        try {
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
            await api.post<AuthenticateResponse>('/api/users/logout', null, {
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

    async update(data: {id: number; banned: boolean}): Promise<User> {
        const response = await api.put<User>(`/api/users/${data.id.toString()}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true,
        });

        return response.data;
    }
}
