import { useEffect, useState } from "react";
import api from '../api/axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

export default function AdminQuotes() {
    const [quotes, setQuotes] = useState([]);
    const [newQuote, setNewQuote] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const adminPass = "serafim123";
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = sessionStorage.getItem("admin");
        if (!loggedIn) navigate("/quotes-login");
        loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadQuotes() {
        const res = await api.get("/quotes");
        setIsLoading(false);
        setQuotes(res.data.quotes);
    }

    async function addQuote() {
        setIsLoading(true);
        await api.post(
            "/quotes",
            { text: newQuote },
            { headers: { "admin-pass": adminPass } }
        );
        setNewQuote("");
        loadQuotes();
    }

    async function editQuote(id, text) {
        setIsLoading(true);
        await api.put(
            `/quotes/${id}`,
            { text },
            { headers: { "admin-pass": adminPass } }
        );
        loadQuotes();
    }

    async function deleteQuote(id) {
        setIsLoading(true);
        setQuotes((prev) => prev.filter((_, index) => index !== id));
        await api.delete(
            `/quotes/${id}`,
            { headers: { "admin-pass": adminPass } }
        );
        loadQuotes();
    }

    return (
        <div style={{ width: "60%", margin: "auto", marginTop: "40px" }}>
            {isLoading ? <CircularProgress/> : ''}
            <h1 style={{color: '#000'}}>إدارة الجمل</h1>

            <div>
                <input
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    placeholder="أضف جملة جديدة"
                    style={{color: '#000'}}
                />
                <button onClick={addQuote}>إضافة</button>
            </div>

            <hr />

            {quotes.map((q, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                    }}
                >
                    <input
                        style={{ width: "70%", color: '#000' }}
                        value={q}
                        onChange={(e) => {
                            const newArr = [...quotes];
                            newArr[i] = e.target.value;
                            setQuotes(newArr);
                        }}
                    />
                    <button onClick={() => editQuote(i, quotes[i])}>حفظ</button>
                    <button onClick={() => deleteQuote(i)}>حذف</button>
                </div>
            ))}
        </div>
    );
}
