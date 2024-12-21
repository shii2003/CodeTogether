import React from 'react';
import { FiLogOut } from "react-icons/fi";

const LogoutButton: React.FC = () => {

    return (
        <button className='flex gap-3 border items-center justify-center border-indigo-300 bg-indigo-300 rounded-md bg-opacity-20 px-4 py-2 text-indigo-200 hover:bg-opacity-25 hover:text-indigo-100'>
            <FiLogOut />
            <p className='hidden sm:block'>Logout</p>
        </button>
    )
}
export default LogoutButton;