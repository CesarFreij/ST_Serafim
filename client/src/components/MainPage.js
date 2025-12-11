import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import "../mainPage/assets/css/main.css";
import "../mainPage/assets/css/fontawesome-all.min.css";
import "../mainPage/assets/css/noscript.css";
import api from '../api/axios'
import Button from '@mui/material/Button';

function ProfileLanding({username: propUsername}) {
    let points = 0;
    const [username, setUsername] = useState(propUsername || "");
    const [verse, setVerse] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        async function fetchVerse() {
            const quote = await getVerse();
            setVerse(quote);
        }
        fetchVerse();
        // بدل window.onload
        document.body.classList.remove("is-preload");

        // منع التاتش سكرول
        const disableTouch = (e) => e.preventDefault();
        window.addEventListener("touchmove", disableTouch, { passive: false });

        // بدل onorientationchange
        const onOrientation = () => {
        document.body.scrollTop = 0;
        };
        window.addEventListener("orientationchange", onOrientation);

        const storedUser = sessionStorage.getItem('username');
        if(storedUser) setUsername(storedUser)

        // cleanup لما يطلع من الصفحة
        return () => {
        window.removeEventListener("touchmove", disableTouch);
        window.removeEventListener("orientationchange", onOrientation);
        };
    }, []);

    async function handlePoints(e) {
        e.preventDefault();
        const element = e.currentTarget.id;
        switch(element) {
            case 'الصلاة': 
                points = 30; break;
            case 'الصوم': 
                points = 40; break;
            case 'الصديق': 
                points = 1000; break;
            case 'الكتاب-المقدس': 
                points = 30; break;
            case 'الكنيسة': 
                points = 50; break;
            default : 
                console.error('error');
            }

        try {
            const response = await api.post('/add-points', {
                username: sessionStorage.getItem("username"),
                points,
                todo: element
            });
            enqueueSnackbar(response.data.message, {variant: "success", style:{width: 'fit-content'}})
        } catch (error) {
            if (error.response?.status === 400) {
                enqueueSnackbar(error.response.data.message, { variant: "error", style:{width: 'fit-content'}});
            } else {
                enqueueSnackbar("صار خطأ بالسيرفر", { variant: "error", style:{width: 'fit-content'}});
            }
        }        
    }

    function handleLogout() {
        sessionStorage.removeItem('username')
        navigate('/login');
    }

    async function getVerse() {
        try {
            const response = await api.get('/daily-quote');
            return response.data.quote;
        } catch (error) {
            console.error("Error fetching quote:", error);
            return "خطأ بجلب الاقتباس";
        }
    }

    return (
        <div id="wrapper">
            <div id="bg"></div>
            <div id="overlay"></div>
                <p style={{
                    position: "relative",
                    zIndex: 9999,
                    fontSize: "25px",
                    padding: "20px",
                    margin: "20px",
                    backgroundColor: "#ffa5004f",
                    borderRadius: "20px",
                }}>
                    {verse}
                </p>

            <div id="main">
                {/* Header */}
                <header id="header">
                    <h1>{username}</h1>
                    <nav>
                        <ul>
                        <li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a onClick={e => handlePoints(e)} id="الصلاة" className="fa-solid fa-person-praying">
                            </a>
                        </li>
                        <li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a onClick={e => handlePoints(e)} id="الصوم" className="fa-solid fa-ban">
                            <i className="fa-solid fa-burger" 
                            style={{position: 'absolute', top: '50%', left: '50%', 
                            transform: 'translate(-50%, -50%)'}}></i>
                            </a>
                        </li>
                        <li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a onClick={e => handlePoints(e)} id="الصديق" className="fa-solid fa-user-group">
                            </a>
                        </li>
                        <li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a onClick={e => handlePoints(e)} id="الكتاب-المقدس" className="fa-solid fa-book-bible">
                            </a>
                        </li>
                        <li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a onClick={e => handlePoints(e)} id="الكنيسة" className="fa-solid fa-church">
                            </a>
                        </li>
                        </ul>
                    </nav>
                    <Button onClick={handleLogout} sx={{color: "white"}}>
                        تسجيل الخروج
                    </Button>
                </header>
            </div>
        </div>
    );
}

export default ProfileLanding;
