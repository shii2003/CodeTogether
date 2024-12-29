"use client";
import ResponsiveLogo from '@/components/logo/ResponsiveLogo';
import { useAppDispatch, useAppSelector } from '@/store/hooks/hooks';
import { signup } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type pageProps = {

};

const page: React.FC<pageProps> = () => {


    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const router = useRouter();

    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = formData;
        const response = dispatch(signup({ username, email, password, confirmPassword }));
        console.log("Signup Data:", response);
        router.push('/menu')
    }

    return (
        <div className='flex  items-center justify-center h-full '>
            <div className=" sm:w-full bg-neutral-900 bg-opacity-70  rounded-lg shadow border-2 border-neutral-800 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className='flex items-center justify-center'>
                        <ResponsiveLogo />
                    </div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-neutral-400 md:text-2xl">
                        Create an account
                    </h1>
                    <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-neutral-300"
                            >
                                Your Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                name="username"
                                id="username"
                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                placeholder="Jhon Doeeeee"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-neutral-300"
                            >
                                Your email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                name="email"
                                id="email"
                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                placeholder="name@company.com"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-neutral-300"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                name="password"
                                id="password"
                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                placeholder="••••••••"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block mb-2 text-sm font-medium text-neutral-300"
                            >
                                Confirm password
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                name="confirmPassword"
                                id="confirmPassword"
                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                placeholder="••••••••"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full text-white  focus:ring focus:outline-none focus:ring-indigo-400  bg-indigo-300 bg-opacity-10 hover:bg-opacity-25 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            {loading ? "Creating account..." : "Create and account"}
                        </button>
                        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                        <p className="text-sm font-light text-gray-400">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-blue-500 hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default page;