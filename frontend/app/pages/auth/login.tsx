import React, {useState} from "react";
import {useNavigate} from "react-router";
import {UserService} from "~/services/user_service";

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigator = useNavigate();
    const [error, setError] = useState(false);

    function clearInputs (){
        setPassword('');
        setUsername('');
    }

    function validateData(){
        if (!username.trim()) {
            throw new Error('Please enter a valid post title.');
        }

        if (!password.trim()) {
            throw new Error('Please enter a valid post text.' );
        }
    }

    const login = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            validateData();
            new UserService().login({username, password}).then(() => {
                clearInputs();
                navigator("/posts");
            }).catch((err) => setError(err));
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className="w-screen h-screen grid items-center">
            <div className="absolute -z-10w-screen h-screen bg-gradient-to-br from-[#e74c3c] via-[#641e16] to-[#ec7063]"></div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <p className="text-white-300 text-center uppercase text-sm font-bold -mb-2">Sign in to your account</p>
                    <h1 className="text-7xl text-center font-extrabold bg-gradient-to-r from-[#e74c3c] from-35% to-white bg-clip-text text-transparent pb-5">Lategram</h1>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" className="space-y-3" onSubmit={login}>
                        {error && (
                            <p className="block text-sm/6 font-medium text-[#e74c3c]">
                                Something went wrong! Please verify credentials and try again.
                            </p>
                        )}
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-white-300">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    required
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    autoComplete="username"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#e74c3c] sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-white-300">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    placeholder="Enter password"
                                    type="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#e74c3c] sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex cursor-pointer w-full justify-center transition-all rounded-md bg-[#e74c3c] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#f8988a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e74c3c]"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '}
                        <a href="/register" className="font-semibold text-[#e74c3c] hover:text-[#f8988a] transition-all">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
