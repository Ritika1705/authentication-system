import React from 'react'
import { motion } from 'framer-motion'
import {Lock, Mail, User} from "lucide-react";
import Input from '../components/Input'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react';

const SignupPage = () => {

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const {signup, error, isLoading} = useAuthStore();

  const handleSignUp = async(e) => {
    e.preventDefault();
    try{
        await signup(email, password, name);
        navigate('/verify-email');
    }catch (error) {
        console.error("Error signing up:", error);
        // Handle error (e.g., show a notification)
    }
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl
        overflow-hidden'
    >
        <div className='p-8'>
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500
            text-transparent bg-clip-text'>
                Create an Account
            </h2>
            <form onSubmit={handleSignUp}>
                <Input
                    icon={User}
                    type='text'
                    placeholder='Full Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    icon={Mail}
                    type='email'
                    placeholder='Email Address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    icon={Lock}
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                <PasswordStrengthMeter password={password} />
                <motion.button
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
                        {/* Sign Up */}
				</motion.button>                    
            </form>
        </div>
    </motion.div>
  )
}

export default SignupPage