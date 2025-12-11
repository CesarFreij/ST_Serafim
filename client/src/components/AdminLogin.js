import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await api.post("/quotes-login", { username, password });
            if (res.data.success) {
                sessionStorage.setItem("admin", true);
                navigate("/quotes");
            }
        } catch (err) {
            setError(err.response?.data?.message || "خطأ في تسجيل الدخول");
        }
    }

    return (
        <div style={{ width: "400px", margin: "50px auto" }}>
            <h1>تسجيل دخول الأدمن</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin} dir="rtl">
                <input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{color: '#000'}}
                />
                <br />
                <input
                    type="password"
                    placeholder="كلمة السر"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{color: '#000'}}
                />
                <br />
                <button type="submit" style={{padding: '6px 20px', marginTop: '10px'}}>دخول</button>
            </form>
        </div>
    );
}
