import React, { useState, useCallback, useRef } from 'react'
import IconInput from '@components/elements/iconInput'
import axios from "axios"
import Mask from '@components/layout/mask'
import toast from "@components/toast"
import { API_BASE_URL } from "@utils/consts"

interface RegisterProps {
  toRegister: (value: boolean) => void
  toLogin: (value: boolean) => void
}

const Login: React.FC<RegisterProps> = (props: RegisterProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotPass, setForgotPass] = useState(false)
  const [recievedEmail, setRecievedEmail] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [opt, setOtp] = useState('')
  const [isVerify, setIsVerify] = useState(false)

  type ToastType = 'success' | 'info' | 'error' | 'warning'

  const notification = useCallback((type: ToastType, message: string) => {
    toast({ type, message })
  }, [])

  let emailInput = useRef<HTMLInputElement>(null)
  let passwordInput = useRef<HTMLInputElement>(null)
  let resetCodeInput = useRef<HTMLInputElement>(null)

  const toRegister = () => {
    props.toLogin(false)
    props.toRegister(true)
  }

  const cancelLogin = () => props.toLogin(false)

  const sendEmail = async () => {
    if (!email) {
      alert('Pleae input email')
      if (emailInput.current) emailInput.current.focus()
      return
    }

    try {
      let res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email
      })

      if (res && res.status === 200) {
        setRecievedEmail(true)
        setResetCode('')
        setOtp(res.data.token)
        alert(res.data.message)
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

  const verifyOtp = async () => {
    if (!resetCode || !opt) {
      alert('Invalid')
      return
    }

    try {
      let res = await axios.post(`${API_BASE_URL}/auth/verifyOtp`, {
        code: Number(resetCode), token: opt
      })

      if (res && res.status === 200) {
        setIsVerify(true)
        setPassword('')
        setOtp(res.data.token)
        alert(res.data.message)
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

  const resetPassword = async () => {
    if (!password || !opt) {
      alert('Invalid')
      return
    }

    try {
      let res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        newPassword: password, token: opt
      })

      if (res && res.status === 200) {
        alert(res.data.message)
        setForgotPass(false)
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

  const confirm = async () => {
    if (!email) {
      notification('warning', 'Please input email')
      alert('Please input email')
      if (emailInput.current) emailInput.current.focus()
      return
    }
    if (!password) {
      alert('Please input password')
      if (passwordInput.current) passwordInput.current.focus()
    }

    try {
      let res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email, password
      })
      if (res.status === 200) {
        alert(res.data.message)
        cancelLogin()
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
    <div className='fixed z-10 inset-0 overflow-y-auto'>
      <div className='flex min-h-full items-center justify-center text-center sm:p-0'>
        <div className='min-[768px]:w-[32rem] w-full relative overflow-visible bg-white py-2rem text-left rounded-'>
          <div className="absolute right-0 top-0 pr-5 pt-5">
            <button onClick={cancelLogin} type="button" className="focus:outline-none focus:ring-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M9.33325 9.33331L15.9999 16M22.6666 22.6666L15.9999 16M15.9999 16L22.6666 9.33331M15.9999 16L9.33325 22.6666" stroke="#050608" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className=" "></path></svg>
            </button>
          </div>
          <div className='flex w-full flex-col items-center px-4 sm:px-6 py-6'>
            <h1 className='mt-[1rem] text-[1.5rem] leading-[2rem] uppercase text-gray-900 font-normal'>Welcome back</h1>
            <div className='mb-6 mt-1 flex flex-row gap-1'>
              <p className='text-1rem leading-6 text-gray-800'>Don't have an account?</p>
              <p onClick={toRegister} className='cursor-pointer font-bold text-gray-800 leading-6 underline'>Sign Up</p>
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
                handler={confirm}
                placeholder='Password'
                parentChange={setPassword}
                parrentRef={passwordInput} />
              <div className='flex my-1'>
                <p
                  className='text-black cursor-pointer font-normal text-[1rem]'
                  onClick={() => setForgotPass(true)}>
                  Forgot password?
                </p>
              </div>
              <button onClick={confirm} className='text-black text-[1.5rem] w-full bg-green-400 hover:bg-green-500 py-2'>Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {forgotPass ? <><Mask />
      <div>
        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center text-center sm:p-0'>
            <div className='min-[768px]:w-[32rem] w-full relative overflow-visible bg-white py-2rem text-left rounded-'>
              <div className="absolute right-0 top-0 pr-5 pt-5">
                <button onClick={() => setForgotPass(false)} type="button" className="focus:outline-none focus:ring-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M9.33325 9.33331L15.9999 16M22.6666 22.6666L15.9999 16M15.9999 16L22.6666 9.33331M15.9999 16L9.33325 22.6666" stroke="#050608" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className=" "></path></svg>
                </button>
              </div>
              <div className='flex w-full flex-col items-center px-4 sm:px-6 py-6'>
                <h1 className='mt-[1rem] text-[1.5rem] leading-[2rem] uppercase text-gray-900 font-normal'>{isVerify ? 'Reset Password' : 'Forgot Password'}</h1>
                <div className="flex w-full flex-col gap-4 mt-7">
                {
                    isVerify
                      ? <IconInput
                        className='w-full'
                        inputClassName='w-full bg-gray-200 my-1 outline-none py-4 px-5 text-[1rem] text-black'
                        type='password'
                        autoFocus={true}
                        placeholder='New Password'
                        value={password}
                        handler={resetPassword}
                        parentChange={setPassword}
                        parrentRef={passwordInput} />
                      : recievedEmail
                        ? <IconInput
                          className='w-full'
                          inputClassName='w-full bg-gray-200 my-1 outline-none py-4 px-5 text-[1rem] text-black'
                          type='text'
                          autoFocus={true}
                          placeholder='Code'
                          value={resetCode}
                          handler={verifyOtp}
                          parentChange={setResetCode}
                          parrentRef={resetCodeInput} />
                        : <IconInput
                          className='w-full'
                          inputClassName='w-full bg-gray-200 my-1 outline-none py-4 px-5 text-[1rem] text-black'
                          type='email'
                          autoFocus={true}
                          placeholder='Email'
                          value={email}
                          handler={sendEmail}
                          parentChange={setEmail}
                          parrentRef={emailInput} />
                  }
                  {/* <IconInput
                    className='w-full'
                    inputClassName='w-full bg-gray-200 my-1 outline-none py-4 px-5 text-[1rem] text-black' type={isVerify ? 'password' : recievedEmail ? 'text' : 'email'}
                    autoFocus={true}
                    placeholder={isVerify ? 'New Password' : recievedEmail ? 'Code' : 'Email'}
                    value={isVerify ? password : recievedEmail ? resetCode : email}
                    handler={isVerify ? resetPassword : recievedEmail ? verifyOtp : sendEmail}
                    parentChange={isVerify ? setPassword : recievedEmail ? setResetCode : setEmail}
                    parrentRef={isVerify ? passwordInput : recievedEmail ? resetCodeInput : emailInput} /> */}
                  <button onClick={isVerify ? resetPassword : recievedEmail ? verifyOtp : sendEmail} className='text-black text-[1.3rem] w-full bg-green-400 hover:bg-green-500 py-2 mt-2'>{'Continue'}</button>
                  <div className='flex my-1'>
                    <p className='text-1rem leading-6 text-gray-800'>Remember your password?</p>
                    <p onClick={() => setForgotPass(false)} className='cursor-pointer font-bold text-gray-800 leading-6 underline'>&nbsp;Log In</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </> : <></>}
  </>
  )
}

export default Login
