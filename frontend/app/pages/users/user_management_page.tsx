import React, { useState } from 'react';
import type {User} from "~/entities/user";
import {UserService} from "~/services/user_service";

type UserManagementPageProps = {
    users: User[];
};

export function UserManagementPage({ users }: UserManagementPageProps) {
    const [userList, setUserList] = useState(users);

    const toggleBanStatus = async (userId: number, currentBanStatus: boolean) => {
       await new UserService().toggleBan(userId, currentBanStatus);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto mt-12 bg-[#1c1c1c] text-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <ul className="space-y-4">
                {userList.map(user => (
                    <li key={user.id} className="flex justify-between items-center bg-[#2c2c2c] p-4 rounded-md">
                        <div>
                            <span className="font-medium">{user.attributes.username}</span>
                            {user.attributes.isBanned && (
                                <span className="ml-2 text-red-500 text-sm">(Banned)</span>
                            )}
                        </div>
                        <button
                            onClick={() => toggleBanStatus(user.id, user.attributes.isBanned)}
                            className={`px-4 py-1 rounded-full text-sm font-semibold transition cursor-pointer ${
                                user.attributes.isBanned
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {user.attributes.isBanned ? 'Unban' : 'Ban'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
