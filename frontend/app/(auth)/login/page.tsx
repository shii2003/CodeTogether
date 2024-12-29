"use client"
import ResponsiveLogo from '@/components/logo/ResponsiveLogo';
import { useAppDispatch, useAppSelector } from '@/store/hooks/hooks';
import { login } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type pageProps = {

};

const page: React.FC<pageProps> = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const router = useRouter();

    const handleSumbit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            console.log("Login result:", result);
            router.push('/menu');
        } else if (login.rejected.match(result)) {
            console.log("Login failed: result.payload");
        }

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    return (
        <div className='h-full flex  items-center justify-center'>
            <div className=" sm:w-full bg-neutral-900 bg-opacity-70  rounded-lg shadow border-2 border-neutral-800 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className='flex items-center justify-center'>
                        <ResponsiveLogo />
                    </div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-neutral-400 md:text-2xl">
                        Login
                    </h1>
                    <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleSumbit}
                    >

                        <div className='mb-6 flex  flex-col gap-4'>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-neutral-300"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    name="email"
                                    id="email"
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="name@company.com"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className=''>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-neutral-300"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    name="password"
                                    id="password"
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full  text-white  focus:ring focus:outline-none focus:ring-indigo-400  bg-indigo-300 bg-opacity-10 hover:bg-opacity-25 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'cursor-wait opacity-50' : ''}`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                        <p className="text-sm font-light text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-medium text-blue-500 hover:underline"
                            >
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default page;