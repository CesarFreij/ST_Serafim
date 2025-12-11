import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login/css/login.css";
import "../login/css/all.min.css";
import api from '../api/axios';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';


const LoginRegister = ({setUsername}) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [active, setActive] = useState(false);

    const [loginUser, setLoginUser] = useState("");
    const [loginPass, setLoginPass] = useState("");

    const [regUser, setRegUser] = useState("");
    const [regPass, setRegPass] = useState("");
    const [regPassCon, setRegPassCon] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCon, setShowPasswordCon] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    
    const [isLoading, setIsloading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        try {
            setIsloading(true);
            await api.post('/login', {
                username: loginUser,
                password: loginPass,
            })
            setUsername(loginUser);
            sessionStorage.setItem('username', loginUser);
            navigate("/add-points");
        } catch (error) {
            console.log(error);
            if(error.response?.data?.error)
                setErrorMsg(error.response.data.error);
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setIsloading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setIsloading(true);
        try {
            if(regPass !== regPassCon)
                throw new Error('كلمة المرور غير متطابقة!')
            await api.post('/register', {
                username: regUser,
                password: regPass,
            });
            setUsername(regUser);
            sessionStorage.setItem('username', regUser);
            navigate('/add-points');
        } catch (error) {
            console.log(error);
            if(error.response?.data?.error)
                setErrorMsg(error.response.data.error);
            else
                setErrorMsg(error.message);
            setTimeout(_ => setErrorMsg(""), 3000);
        } finally {
            setIsloading(false);
        }
    }

    return (
        <div className="body">
            {errorMsg && (
                <Alert
                id="alert"
                variant="filled"
                severity="error"
                style={{
                    position: "fixed",
                    top: "5%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999999,
                    width: "fit-content",
                    paddingRight: 0,
                }}
                >
                
                <p style={{paddingRight: 6}}>{errorMsg}</p>
                </Alert>
            )};

            <div className={`container ${active ? "active" : ""}`}>
            {/* Login Form */}
            <div className={`form-box login ${isLogin ? "active" : ""}`}>
                <form onSubmit={handleLogin}>
                <h1>تسجيل الدخول</h1>
                {isLoading ? <CircularProgress/> : ''}
                <div className="input-box">
                    <input type="text" name="username" placeholder="اسم المستخدم" required
                    value={loginUser} onChange={e => setLoginUser(e.target.value)}/>
                    <i className="fa-solid fa-user"></i>
                </div>

                <div className="input-box">
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="كلمة المرور"
                    required
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    autoComplete="username"
                    />
                    <i onClick={_ => setShowPassword(!showPassword)} 
                    className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </div>
                <button type="submit" className="btn" username={loginUser}>
                    تسجيل الدخول
                </button>
                <p>فكما التاجر يبيع ويشتري ليربح ويكسب ويكدّس الأموال، كذلك على المؤمن أن يعمل نهارًا وليلًا ليجتني الروح القدس</p>

                </form>
            </div>

            {/* Register Form */}
            <div className={`form-box register ${!isLogin ? "active" : ""}`}>
                <form onSubmit={handleRegister}>
                <h1>تسجيل</h1>
                {isLoading ? <CircularProgress/> : ''}
                <div className="input-box">
                    <input type="text" name="username" placeholder="اسم المستخدم" required 
                    value={regUser} onChange={e => setRegUser(e.target.value)}/>
                    <i className="fa-solid fa-user"></i>
                </div>

                <div className="input-box">
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="كلمة المرور"
                    required
                    value={regPass} 
                    onChange={e => setRegPass(e.target.value)}
                    autoComplete="username"
                    />
                    <i onClick={_ => setShowPassword(!showPassword)}
                    className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </div>
                <div className="input-box">
                    <input
                    type={showPasswordCon ? "text" : "password"}
                    name="password"
                    placeholder="تأكيد كلمة المرور"
                    required
                    value={regPassCon} 
                    onChange={e => setRegPassCon(e.target.value)}
                    autoComplete="username"
                    />
                    <i onClick={_ => setShowPasswordCon(!showPasswordCon)}
                    className={showPasswordCon ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </div>

                <button type="submit" className="btn" username={regPassCon}>
                    تسجيل
                </button>

                </form>
            </div>

            {/* Toggle Box */}
            <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                <h1>فرقة القديس سيرافيم ساروفسكي</h1>
                <p>الصف السابع</p>
                <Link to='/register'>
                    <button className="btn register-btn" onClick={() => {
                        setIsLogin(false)
                        setActive(true)
                    }}>
                        تسجيل
                    </button>
                </Link>
                </div>

                <div className="toggle-panel toggle-right">
                <h1>فرقة القديس سيرافيم ساروفسكي</h1>
                <p>الصف السابع</p>
                <Link to="/login">
                    <button className="btn login-btn" onClick={() => {
                        setIsLogin(true)
                        setActive(false)
                    }}>
                        تسجيل الدخول
                    </button>
                </Link>
                </div>
            </div>
            </div>
        </div>
    );
};

export default LoginRegister;
