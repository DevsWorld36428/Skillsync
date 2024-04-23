import React, { useState, useEffect, useRef } from 'react'
import IconInput from '@components/elements/iconInput'
import axios from "axios"
import Mask from '@components/layout/mask'
import { useRouter } from "next/router"
import { API_BASE_URL, BASE_URL } from "@utils/consts"

interface RegisterProps {
  toRegister: (value: boolean) => void
  toLogin: (value: boolean) => void
}

const Register: React.FC<RegisterProps> = (props: RegisterProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  let emailInput = useRef<HTMLInputElement>(null)
  let passwordInput = useRef<HTMLInputElement>(null)

  const toLogin = () => {
    props.toRegister(false)
    props.toLogin(true)
  }

  const cancelRegister = () => props.toRegister(false)

  const confirm = async () => {
    if (!email) {
      alert('Please input email')
      if (emailInput.current) emailInput.current.focus()
      return
    }
    if (!password) {
      alert('Please input password')
      if (passwordInput.current) passwordInput.current.focus()
    }

    try {
      let res = await axios.post(`${API_BASE_URL}/auth/register`, {
        email, password
      })
      if (res.status === 201) {
        alert(res.data.message)
        cancelRegister()
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.code) // Log AxiosError response data
        alert(err.response?.data.message) // Log AxiosError message
      } else {
        console.log(err instanceof Error ? err.message : 'Unknown error')
      }
    }
  }

  return (<>
    <Mask />
    <div className='fixed inset-0 z-10 overflow-y-auto'>
      <div className='flex min-h-full items-center justify-center text-center sm:p-0'>
        <div className='min-[768px]:w-[32rem] w-full relative overflow-visible bg-white py-2rem text-left rounded-'>
          <div className="absolute right-0 top-0 pr-5 pt-5">
            <button onClick={cancelRegister} type="button" className="focus:outline-none focus:ring-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M9.33325 9.33331L15.9999 16M22.6666 22.6666L15.9999 16M15.9999 16L22.6666 9.33331M15.9999 16L9.33325 22.6666" stroke="#050608" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className=" "></path></svg>
            </button>
          </div>
          <div className='flex w-full flex-col items-center px-4 sm:px-6 py-6'>
            <h1 className='mt-[1rem] text-[1.5rem] leading-[2rem] uppercase text-gray-900 font-normal'>Welcome to site</h1>
            <div className='mb-6 mt-1 flex flex-row gap-1'>
              <p className='text-1rem leading-6 text-gray-800'>Already have an account?</p>
              <p onClick={toLogin} className='cursor-pointer font-bold text-gray-800 leading-6 underline'>Log In</p>
            </div>
            <div className="flex w-full flex-col gap-4">
              <IconInput
                className='w-full'
                inputClassName='w-full bg-gray-200 my-1 outline-none py-4 px-5 text-[1rem] text-black' type='email'
                autoFocus={true}
                placeholder='Email'
                value={email}
                handler={confirm}
                parentChange={setEmail}
                parrentRef={emailInput} />
              <IconInput
                className='w-full'
                inputClassName='w-full bg-gray-200 my-1 outline-none py-4 px-5 text-[1rem] text-black' type='password'
                value={password}
                placeholder='Password'
                handler={confirm}
                parentChange={setPassword}
                parrentRef={passwordInput} />
              <button onClick={confirm} className='text-black text-[1.5rem] w-full bg-green-400 hover:bg-green-500 py-2'>Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Register
