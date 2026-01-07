import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import "../mainPage/assets/css/main.css";
import "../mainPage/assets/css/fontawesome-all.min.css";
import "../mainPage/assets/css/noscript.css";
import api from '../api/axios'
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";

function ProfileLanding({username: propUsername}) {
    let points = 0;
    const [username, setUsername] = useState(propUsername || "");
    const [verse, setVerse] = useState("");
    const [isLoading, setIsloading] = useState(false);
    const [isLoadingPoints, setIsloadingPoints] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState("");
    const [pendingTodo, setPendingTodo] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [point, setPoints] = useState([]);
    const [p, setP] = useState(0);
    const [OpenPoints, setOpenPoints] = useState(false);

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

    function handlePoints(e) {
        e.preventDefault();
        const element = e.currentTarget.id;
        setSelectedTodo(element === 'الكتاب-المقدس' ? 'الكتاب المقدس' : element);
        switch(element) {
            case 'الصلاة': points = 30; break;
            case 'الصوم': points = 40; break;
            case 'الصديق': points = 1000; break;
            case 'الكتاب-المقدس': points = 30; break;
            case 'الكنيسة': points = 50; break;
            default : console.error('error');
        }
        setP(points);
        setPendingTodo(element);
        setConfirm(true);
    }

    async function handleAddPoints() {
        setConfirm(false);
        switch(pendingTodo) {
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
            setIsloading(true);
            const response = await api.post('/add-points', {
                username: sessionStorage.getItem("username"),
                points,
                todo: pendingTodo
            });
            enqueueSnackbar(response.data.message, {variant: "success", style:{width: 'fit-content'}})
        } catch (error) {
            if (error.response?.status === 400) {
                enqueueSnackbar(error.response.data.message, { variant: "error", style:{width: 'fit-content'}});
            } else {
                enqueueSnackbar("صار خطأ بالسيرفر", { variant: "error", style:{width: 'fit-content'}});
            }
        } finally {
            setIsloading(false);
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

async function handleGetPoints(username) {
    try {
        setIsloadingPoints(true);
        setOpenPoints(true);
        
        const response = await api.get('/get-points', {
            params: { username }
        });

        setPoints(response.data.points);

    } catch (error) {
        console.error('Error fetching points:', error);
    } finally {
        setIsloadingPoints(false);
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
            <Dialog 
                sx={{margin: 0}}
                open={confirm}
                onClose={_ => setConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                disableEnforceFocus
                disableRestoreFocus
                >
                <DialogTitle id="alert-dialog-title" sx={{fontWeight: 'bold', paddingBottom: 0, textAlign: 'end'}}>
                    {`هل أنت متأكد من الضغط على زر ${selectedTodo}؟`}
                </DialogTitle>
                <DialogContent sx={{alignSelf: 'flex-end'}}>
                    !سيتم إضافة{" "}
                    <span style={{ fontWeight: "bold" }}>{p}</span>
                    {"$ "}إلى رصيدك
                </DialogContent>
                <DialogActions sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" onClick={_ => setConfirm(false)} color="error" sx={{width: '100%'}}>إلغاء</Button>
                    <Button variant="contained" onClick={_ => handleAddPoints(true)} color="success" sx={{width: '100%'}}>إضافة</Button>
                </DialogActions>
            </Dialog>
            <div id="main">
                <Dialog
                    open={OpenPoints}
                    onClose={ _ => setOpenPoints(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    disableEnforceFocus
                    disableRestoreFocus
                    >
                    <DialogTitle id="alert-dialog-title">
                        <CircularProgress sx={{ display: isLoadingPoints ? 'block' : 'none', color: "#ffa600ff"}} />
                        {point}
                    </DialogTitle>
                    <DialogActions sx={{display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={_ => setOpenPoints(false)} sx={{color: '#ffa600ff', width: '100%'}}>تم</Button>
                    </DialogActions>
                </Dialog>
                {/* Header */}
                <header id="header" style={{maxWidth: 300}}>
                    {isLoading ? <CircularProgress sx={{ color: "#ffa600ff" }}/> : ''}
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
                </header>
                <Button onClick={handleLogout} sx={{color: "white", position: 'absolute', bottom: 10, left: 10}}>
                    تسجيل الخروج
                </Button>
                <Button onClick={_ => handleGetPoints(username)} sx={{color: "white", position: 'absolute', bottom: 10, right: 10}}>
                    رؤية نقاطي
                </Button>
            </div>
        </div>
    );
}

export default ProfileLanding;
