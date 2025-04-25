import { useAuth } from '../context/UserProvider'
import { User } from "lucide-react";

function Header() {

    const { logout, user } = useAuth();
    // console.log(user);

    return (
        <>
            <div className='flex fixed top-0 w-full py-2  justify-between  items-center bg-black'>
                <div className='ml-4'><img width={80} src="https://eazr.app/images/EazrLogo.png" alt="" /></div>
                <div className='flex'>
                    <div className='text-black mr-4 flex  ml-auto '> <div className='border-2 border-gray-500 p-1 rounded-full'> <User className="w-4 h-4 text-gray-500 " /> </div> <div className='text-lg text-white ml-2'> {user} </div></div>
                    <div className=' '><button onClick={() => logout()} className='bg-blue-600 text-white px-2 py-1 rounded-sm mx-2 '>
                        logout</button></div>
                </div>
            </div>
        </>
    )
}

export default Header


