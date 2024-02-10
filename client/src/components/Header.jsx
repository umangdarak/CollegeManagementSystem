import image from '../assets/cvrlogo.png';
import { FaPowerOff } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';


export default function Header() {
const navigate=useNavigate();  
const signOut=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('data');
    navigate('/login');
  }
  return (
    <div className='bg-slate-900 flex flex-row items-center justify-between w-full'>
      <div className='flex flex-row items-center'>
      <img src={image} className=' w-20 h-20'/>
        <h1 className=" text-white text-3xl ml-8">College Management System</h1>
        </div>
        <button onClick={signOut} className='mr-10'>
                  <FaPowerOff size={30} color='white'/>

        </button>
    </div>
  )
}
