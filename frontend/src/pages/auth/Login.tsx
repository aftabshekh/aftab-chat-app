import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import login from "../../assets/loginchat.png";
import NavBar from '../../components/NavBar';
import { AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import AuthContext from '../../contexts/AuthContext';
import { Type } from '../../types';
import API from "../../api/axios"; // ✅ axios import

function Login() {

    const [text, setText] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState("");

    const { dispatch } = useContext(AuthContext);

    // ✅ Detect email or username
    useEffect(() => {
        if (text.includes("@")) {
            setUserName("");
            setEmail(text);
        } else {
            setEmail("");
            setUserName(text);
        }
    }, [text]);

    // ✅ LOGIN FUNCTION
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const loginData = text.includes("@")
                ? { email, password }
                : { userName, password };

            const res = await API.post("/api/auth/login", loginData);

            setLoading(false);

            // ✅ save user
            dispatch({ type: Type.LOGIN, payload: res.data });
            localStorage.setItem("user", JSON.stringify(res.data));

        } catch (error: any) {
            setLoading(false);
            setErr(error?.response?.data?.error || "Login failed");

            setTimeout(() => setErr(""), 3000);
        }
    };

    return (
        <>
            <NavBar />

            <div className='flex flex-wrap justify-around items-center mt-20 mb-8'>
                <div>
                    <img className='w-[340px]' src={login} alt="login" />
                    <p className='sm:text-2xl text-lg text-center'>
                        Welcome back. Login your account to continue having fun.
                    </p>
                </div>

                <div className='bg-navbg text-center sm:mt-0 mt-8 sm:w-96 h-[400px] flex flex-col rounded-lg p-6'>
                    <h2 className='text-2xl font-heading'>Login</h2>

                    <form onSubmit={handleSubmit} className='mt-6'>

                        {/* Username / Email */}
                        <div className='flex items-center my-4 bg-gray-900 py-1 rounded-md'>
                            <p className='h-[40px] flex items-center justify-center p-2'>
                                <AiOutlineUser size={20} />
                            </p>

                            <input
                                value={text}
                                onChange={e => setText(e.target.value)}
                                className='w-11/12 py-2 px-1 bg-gray-900 outline-none'
                                type="text"
                                placeholder='Username or Email'
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className='flex items-center my-4 bg-gray-900 py-1 rounded-md'>
                            <p className='h-[40px] flex items-center justify-center p-2'>
                                <RiLockPasswordFill size={20} />
                            </p>

                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className='w-11/12 py-2 px-1 bg-gray-900 outline-none'
                                type="password"
                                placeholder='Password'
                                required
                            />
                        </div>

                        {/* Error */}
                        {err && (
                            <div className='text-red-300 text-sm'>
                                {err}
                            </div>
                        )}

                        {/* Button */}
                        <div className='w-full flex items-center justify-center mt-4'>
                          <button
    type="submit"
    disabled={loading}
    className={`${loading ? "cursor-not-allowed" : "active:scale-75"} bg-login text-gray-600 px-4 py-2 rounded-lg font-bold flex items-center justify-center duration-300`}
>
    {loading && (
        <div className='animate-spin w-5 h-5 border-[2px] border-gray-600 rounded-full border-t-black mr-1'></div>
    )}
    Login
</button>
                        </div>

                    </form>

                    <h3 className='mt-7'>
                        Don't have an account?{" "}
                        <Link className='text-register' to="/register">
                            Register
                        </Link>
                    </h3>
                </div>
            </div>
        </>
    );
}

export default Login;