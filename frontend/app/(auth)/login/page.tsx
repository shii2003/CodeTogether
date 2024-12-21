import ResponsiveLogo from '@/components/logo/ResponsiveLogo';
import Link from 'next/link';
import React from 'react';

type pageProps = {

};

const page: React.FC<pageProps> = () => {

    return (
        <div className='flex  items-center justify-center h-full '>
            <div className=" sm:w-full bg-neutral-900 bg-opacity-70  rounded-lg shadow border-2 border-neutral-800 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className='flex items-center justify-center'>
                        <ResponsiveLogo />
                    </div>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-neutral-400 md:text-2xl">
                        Login
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#">

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
                                    name="email"
                                    id="email"
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="name@company.com"
                                    required
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
                                    name="password"
                                    id="password"
                                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg placeholder-neutral-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>


                        <button
                            type="submit"
                            className="w-full  text-white  focus:ring focus:outline-none focus:ring-indigo-400  bg-indigo-300 bg-opacity-10 hover:bg-opacity-25 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Create an account
                        </button>
                        <p className="text-sm font-light text-gray-400">
                            Already have an account?{" "}
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