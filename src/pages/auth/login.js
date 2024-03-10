import Link from "next/link";
import { useEffect, useState } from "react";
import { validateForm } from "@/utils/helper";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';

export default function Login() {

    const router = useRouter()
    const formOG = {
        email: '',
        password: ''
    }
    const formValidation = {
        email: 'email',
        password: 'password'
    }
    const [form, setForm] = useState(formOG)
    const [error, setError] = useState({ formOG })
    const [showError, setShowError] = useState(false)
    const [users, setUsers] = useState([])

    const handleChange = (e) => {
        const { name, value } = e?.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowError(true)
        pageFormValidation(true)
    }

    const pageFormValidation = async (call = false) => {
        const result = await validateForm(form, formValidation, [])
        if (result === true && call && !users?.length) {
            toast.error('No User Found !!!')
        } else if (result === true && call && users?.length) {
            setError({})
            let newUser = users.findIndex(el => el?.email === form?.email)
            if (newUser !== -1) {
                loginUser(form?.email)
            } else {
                toast.error('No User Found !!!')
            }
        } else {
            setError(result)
        }
    }

    const loginUser = (email) => {
        let user = users.find(el => el?.email === form?.email)
        if (user) {
            toast.success('Logged In Successfully')
            localStorage.setItem("currentUser", JSON.stringify(user));
            router.push('/dashboard')
        }
    }

    const getUsers = () => {
        let userArr = JSON.parse(localStorage.getItem('users'))
        setUsers(userArr || [])
    }

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        if (showError) pageFormValidation(false)
    }, [form])

    return (
        <div className="h-full h-lvh bg-white">
            <div className="h-full">
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={form?.email}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <p className="text-red-600 text-sm">{error?.email}</p>
                            </div>

                            <div>
                                {/* <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div> */}
                                <div className="mt-2">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={form?.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <p className="text-red-600 text-sm">{error?.password}</p>
                            </div>

                            <div>
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            New here?
                            <Link href={'/auth/register'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                &nbsp;Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}