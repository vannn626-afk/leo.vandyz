import React from 'react';
import {Eye,EyeOff,LockKeyhole,UserRound,ArrowRight,ShieldCheck} from 'lucide-react';
import {signIn,signUp,friendlyAuthError,isSupabaseConfigured} from '../services/supabase';

const USERNAME_RE=/^[a-z][a-z0-9_-]{2,31}$/;

function useSubmitLock(){
  const lock=React.useRef(false);
  const acquire=()=>{if(lock.current)return false;lock.current=true;return true};
  const release=()=>{window.setTimeout(()=>{lock.current=false},1200)};
  return {acquire,release};
}

export function Login({onSuccess,goRegister}){
  const [username,setUsername]=React.useState('');
  const [password,setPassword]=React.useState('');
  const [show,setShow]=React.useState(false);
  const [loading,setLoading]=React.useState(false);
  const [error,setError]=React.useState('');
  const lock=useSubmitLock();

  const submit=async e=>{
    e.preventDefault();
    if(!lock.acquire())return;
    setError('');
    if(!username.trim()||!password){setError('Username dan password wajib diisi.');lock.release();return}
    setLoading(true);
    try{await signIn(username,password);onSuccess?.()}
    catch(err){setError(friendlyAuthError(err))}
    finally{setLoading(false);lock.release()}
  };

  return <div className="auth-page">
    <div className="auth-orb orb-a"/><div className="auth-orb orb-b"/>
    <div className="auth-card">
      <div className="auth-mark"><ShieldCheck size={22}/></div>
      <small>WELCOME BACK</small><h1>Login to<br/><em>KING VANDYZ</em></h1>
      <p className="auth-sub">Username-only access. No email field required.</p>
      {!isSupabaseConfigured&&<div className="auth-warning">Supabase belum dikonfigurasi. Isi <b>VITE_SUPABASE_URL</b> dan <b>VITE_SUPABASE_ANON_KEY</b>.</div>}
      <form onSubmit={submit}>
        <label>Username<div className="auth-input"><UserRound size={17}/><input autoComplete="username" value={username} onChange={e=>{setUsername(e.target.value);setError('')}} placeholder="username"/></div></label>
        <label>Password<div className="auth-input"><LockKeyhole size={17}/><input autoComplete="current-password" type={show?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('')}} placeholder="••••••••"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
        {error&&<div className="auth-error">{error}</div>}
        <button className="btn primary full" disabled={loading}>{loading?'LOGGING IN…':<>LOGIN <ArrowRight size={16}/></>}</button>
      </form>
      <p className="auth-switch">Belum punya akun? <button type="button" onClick={goRegister}>Register</button></p>
    </div>
  </div>
}

export function Register({onSuccess,goLogin}){
  const [username,setUsername]=React.useState('');
  const [password,setPassword]=React.useState('');
  const [confirm,setConfirm]=React.useState('');
  const [show,setShow]=React.useState(false);
  const [loading,setLoading]=React.useState(false);
  const [error,setError]=React.useState('');
  const lock=useSubmitLock();

  const submit=async e=>{
    e.preventDefault();
    if(!lock.acquire())return;
    setError('');
    const u=username.trim().toLowerCase();
    if(!USERNAME_RE.test(u)){setError('Username 3–32 karakter, harus diawali huruf. Angka, _ dan - hanya opsional. Contoh: fann atau vandyz.');lock.release();return}
    if(password.length<8){setError('Password minimal 8 karakter.');lock.release();return}
    if(password!==confirm){setError('Konfirmasi password tidak cocok.');lock.release();return}
    setLoading(true);
    try{
      const data=await signUp(u,password);
      if(!data?.session){setError('Akun berhasil dibuat, tetapi session belum aktif. Pastikan Confirm Email di Supabase dimatikan, lalu Login.');return}
      onSuccess?.();
    }catch(err){setError(friendlyAuthError(err))}
    finally{setLoading(false);lock.release()}
  };

  return <div className="auth-page register-layout">
    <div className="register-side"><span>100</span><small>FREE CREDITS</small><p>Mulai dari 100 credits. Free credits dipakai lebih dulu sebelum purchased credits.</p></div>
    <div className="auth-card">
      <div className="auth-mark"><UserRound size={22}/></div>
      <small>CREATE ACCOUNT</small><h1>Start with<br/><em>KING VANDYZ</em></h1>
      <p className="auth-sub">Buat username dan password. Email tidak diperlukan.</p>
      <form onSubmit={submit}>
        <label>Username<div className="auth-input"><UserRound size={17}/><input autoComplete="username" value={username} onChange={e=>{setUsername(e.target.value);setError('')}} placeholder="username"/></div></label>
        <label>Password<div className="auth-input"><LockKeyhole size={17}/><input autoComplete="new-password" type={show?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('')}} placeholder="minimal 8 karakter"/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
        <label>Confirm Password<div className="auth-input"><LockKeyhole size={17}/><input autoComplete="new-password" type={show?'text':'password'} value={confirm} onChange={e=>{setConfirm(e.target.value);setError('')}} placeholder="ulangi password"/></div></label>
        {error&&<div className="auth-error">{error}</div>}
        <button className="btn primary full" disabled={loading}>{loading?'CREATING…':<>BUAT AKUN <ArrowRight size={16}/></>}</button>
      </form>
      <p className="auth-switch">Sudah punya akun? <button type="button" onClick={goLogin}>Login</button></p>
    </div>
  </div>
}
