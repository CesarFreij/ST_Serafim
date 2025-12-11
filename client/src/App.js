import './App.css';
import { useState } from 'react';
import LoginRegister from './components/LoginRegister'; 
import MainPage from './components/MainPage';
import { Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AdminQuotes from './components/AdminQuotes';
import AdminLogin from './components/AdminLogin';

function App() {
  const [username, setUsername] = useState("");
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginRegister setUsername={setUsername}/>}/>
        <Route path='/login' element={<LoginRegister setUsername={setUsername}/>}/>
        <Route path='/register' element={<LoginRegister setUsername={setUsername}/>}/>
        <Route path='/add-points' element={
          <SnackbarProvider maxSnack={3}>
            <MainPage username={username}/>
          </SnackbarProvider>
          }/>
        <Route path='/quotes-login' element={<AdminLogin/>}/>
        <Route path='/quotes' element={<AdminQuotes/>}/>
      </Routes>
    </div>
  );
}

export default App;
