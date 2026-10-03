import React from 'react';
import {Wrench as WrenchIcon} from 'lucide-react';import Layout from './components/Layout';import Toast,{useToast} from './components/Toast';import Home from './pages/Home';import Tools from './pages/Tools';import Tool from './pages/Tool';import {Favorites,History,SettingsPage,AboutPage} from './pages/SimplePages';import Admin from './pages/Admin';import Dashboard from './pages/Dashboard';import Orders from './pages/Orders';import Pricing from './pages/Pricing';import Store from './pages/Store';import Profile from './pages/Profile';import {Login,Register} from './pages/Auth';import ToolErrorBoundary from './components/ToolErrorBoundary';import {getCatalog} from './services/api';
import {KNOWN_TOOLS} from './data/catalog.js';import {restoreSession,signOut,getSession} from './services/supabase';import {getMyProfile,touchPresence,listRows,getPublicStats} from './services/platform';import './styles.css';
export default function App(){const [page,setPage]=React.useState('home'),[tools,setTools]=React.useState(KNOWN_TOOLS),[selected,setSelected]=React.useState(null),[search,setSearch]=React.useState(''),[status,setStatus]=React.useState(false),[loadingCatalog,setLoadingCatalog]=React.useState(true),[boot,setBoot]=React.useState(true),[transition,setTransition]=React.useState(false),[profile,setProfile]=React.useState(null),[favorites,setFavorites]=React.useState(()=>{try{return JSON.parse(localStorage.getItem('king-vandyz-favorites')||'[]')}catch{return []}}),[siteSettings,setSiteSettings]=React.useState(null),[homeConfig,setHomeConfig]=React.useState(null),[announcements,setAnnouncements]=React.useState([]),[publicStats,setPublicStats]=React.useState({});const {toast,show}=useToast();
 const refreshProfile=React.useCallback(async()=>{const p=await getMyProfile();setProfile(p);return p},[]);
 React.useEffect(()=>{
  const t=setTimeout(()=>setBoot(false),80);
  // Render the local catalog immediately. Network/Supabase work must never block the first paint.
  setTools(KNOWN_TOOLS);
  setLoadingCatalog(false);
  setStatus(true);
  let cancelled=false;
  const withTimeout=(promise,ms)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
  (async()=>{
    try{await withTimeout(restoreSession(),2500)}catch{}
    try{if(getSession())await withTimeout(refreshProfile(),3500)}catch{}
    if(cancelled)return;
    const results=await Promise.allSettled([
      getCatalog(),
      withTimeout(listRows('site_settings','?select=*&limit=1'),3500),
      withTimeout(listRows('homepage_config','?select=*&limit=1'),3500),
      withTimeout(listRows('announcements','?select=*&order=priority.desc,created_at.desc'),3500),
      withTimeout(listRows('tool_configs','?select=*'),3500)
    ]);
    if(cancelled)return;
    const [cat,ss,hc,aa,tc]=results;
    const d=cat.status==='fulfilled'&&cat.value?cat.value:{tools:KNOWN_TOOLS};
    const site=ss.status==='fulfilled'&&Array.isArray(ss.value)?ss.value:[];
    const home=hc.status==='fulfilled'&&Array.isArray(hc.value)?hc.value:[];
    const notices=aa.status==='fulfilled'&&Array.isArray(aa.value)?aa.value:[];
    const configs=tc.status==='fulfilled'&&Array.isArray(tc.value)?tc.value:[];
    const base=Array.isArray(d.tools)&&d.tools.length?d.tools:KNOWN_TOOLS;
    const merged=base.map(t=>{const c=configs.find(x=>x.tool_id===t.id);return c?{...t,...c,name:c.display_name||t.name,description:c.description||t.description,category:c.category||t.category}:t});
    setTools(merged);
    setSiteSettings(site[0]||null);
    setHomeConfig(home[0]||null);
    setAnnouncements(notices);
    getPublicStats().then(x=>{if(!cancelled)setPublicStats(x||{})}).catch(()=>{});
  })();
  return()=>{cancelled=true;clearTimeout(t)};
},[refreshProfile]);
React.useEffect(()=>{
 const DEFAULTS={
  glass:{bg:'#07080d',surface:'#0d1018',surface2:'#121722',text:'#f6f7fb',muted:'#8d96aa',border:'#2a3040',primary:'#66e6ff',secondary:'#c58cff',accent:'#ff2bd6',highlight:'#66e6ff',shadow:'#000000'},
  brutal:{bg:'#FFFDF5',surface:'#FFFFFF',surface2:'#FFFFFF',text:'#090909',muted:'#4a4640',border:'#090909',primary:'#4D7CFF',secondary:'#A77BFF',accent:'#FF4D5A',highlight:'#FFD23F',shadow:'#090909'},
  city:{bg:'#08111b',surface:'#0d1925',surface2:'#122333',text:'#eff7ff',muted:'#8ba0b6',border:'#2a4257',primary:'#7bd9ff',secondary:'#78a8ff',accent:'#36e1c1',highlight:'#ffcc66',shadow:'#02060b'},
  comic:{bg:'#fff6dc',surface:'#FFFFFF',surface2:'#FFFFFF',text:'#17120d',muted:'#6e5e4c',border:'#17120d',primary:'#1769ff',secondary:'#ff3d8d',accent:'#ffe05c',highlight:'#58d68d',shadow:'#17120d'}
 };
 const applyTheme=()=>{
  let saved=null;try{saved=localStorage.getItem('king-vandyz-theme-v2')}catch{}
  const theme=siteSettings?.default_theme||saved||'brutal';
  document.documentElement.dataset.theme=theme;
  const all=siteSettings?.theme_config&&typeof siteSettings.theme_config==='object'?siteSettings.theme_config:{};
  const cfg={...(DEFAULTS[theme]||DEFAULTS.brutal),...(all?.[theme]||{})};
  const map={bg:'--theme-bg',surface:'--theme-surface',surface2:'--theme-surface2',text:'--theme-text',muted:'--theme-muted',border:'--theme-border',primary:'--theme-primary',secondary:'--theme-secondary',accent:'--theme-accent',highlight:'--theme-highlight',shadow:'--theme-shadow'};
  Object.entries(map).forEach(([k,v])=>document.documentElement.style.setProperty(v,cfg[k]));
 };
 applyTheme();window.addEventListener('kv-theme-change',applyTheme);
 return()=>window.removeEventListener('kv-theme-change',applyTheme);
},[siteSettings]);
 React.useEffect(()=>{const t=setInterval(()=>{getPublicStats().then(x=>setPublicStats(x||{})).catch(()=>{});if(getSession())touchPresence()},120000);return()=>clearInterval(t)},[]);
 const navigate=next=>{if(next==='admin'&&!profile){setPage('login');return}if(next==='admin'&&String(profile.role||'').toUpperCase()!=='ADMIN'){show('Admin access denied.','error');return}if((next==='dashboard'||next==='orders'||next==='profile'||next==='pricing')&&!profile){if(!profile){setPage('login');return}}if(next===page){setPage(next);return}setTransition(true);setTimeout(()=>{setPage(next);window.scrollTo(0,0);setTransition(false)},160)};
 React.useEffect(()=>{try{const reduced=localStorage.getItem('king-vandyz-reduced-motion')==='1';document.documentElement.dataset.motion=reduced?'reduced':'full'}catch{}},[]);
 React.useEffect(()=>{try{localStorage.setItem('king-vandyz-favorites',JSON.stringify(favorites))}catch{}},[favorites]);
 const useTool=async(t,meta={})=>{const event={id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,toolId:t.id,toolName:t.name,time:Date.now(),ok:meta.ok!==false,duration:meta.duration||0,message:meta.message||''};try{const current=JSON.parse(localStorage.getItem('king-vandyz-history')||'[]');localStorage.setItem('king-vandyz-history',JSON.stringify([{tool:t,time:event.time,status:event.ok?'success':'error',duration:event.duration,message:event.message},...current.filter(x=>x.tool.id!==t.id)].slice(0,20)))}catch{};await refreshProfile()};
 const authSuccess=async()=>{await refreshProfile();navigate('dashboard')};const logout=async()=>{await signOut();setProfile(null);navigate('home')};
 let content;if(page==='login')content=<Login onSuccess={authSuccess} goRegister={()=>setPage('register')}/>;else if(page==='register')content=<Register onSuccess={authSuccess} goLogin={()=>setPage('login')}/>;else if(siteSettings?.maintenance_enabled&&String(profile?.role||'').toUpperCase()!=='ADMIN'&&page!=='login'&&page!=='register')content=<div className="maintenance-screen"><div className="maintenance-card"><WrenchIcon/><small>SYSTEM MAINTENANCE</small><h1>{siteSettings.maintenance_title}</h1><p>{siteSettings.maintenance_message}</p>{siteSettings.maintenance_end&&<span>Estimated end: {new Date(siteSettings.maintenance_end).toLocaleString('id-ID')}</span>}</div></div>;else if(page==='home')content=<Home siteSettings={siteSettings} homeConfig={homeConfig} announcements={announcements} publicStats={publicStats} tools={tools} setSelected={setSelected} setPage={navigate} search={search} favorites={favorites} toggleFavorite={t=>setFavorites(f=>f.some(x=>x.id===t.id)?f.filter(x=>x.id!==t.id):[t,...f])}/>;else if(page==='tools')content=<Tools tools={tools} setSelected={setSelected} setPage={navigate} search={search} favorites={favorites} toggleFavorite={t=>setFavorites(f=>f.some(x=>x.id===t.id)?f.filter(x=>x.id!==t.id):[t,...f])}/>;else if(page==='tool'&&selected)content=<ToolErrorBoundary key={selected.id}><Tool tool={selected} profile={profile} setPage={navigate} onUsed={useTool} favorite={favorites.some(x=>x.id===selected.id)} toggleFavorite={()=>setFavorites(f=>f.some(x=>x.id===selected.id)?f.filter(x=>x.id!==selected.id):[selected,...f])}/></ToolErrorBoundary>;else if(page==='dashboard')content=<Dashboard profile={profile} setPage={navigate}/>;else if(page==='orders')content=<Orders profile={profile}/>;else if(page==='pricing')content=<Pricing profile={profile}/>;else if(page==='store')content=<Store profile={profile}/>;else if(page==='profile')content=<Profile profile={profile}/>;else if(page==='admin'&&String(profile?.role||'').toUpperCase()==='ADMIN')content=<Admin profile={profile} catalogTools={tools} onExit={()=>navigate('home')}/>;else if(page==='about')content=<AboutPage/>;else if(page==='favorites')content=<Favorites favorites={favorites} setSelected={setSelected} setPage={navigate}/>;else if(page==='history')content=<History history={(()=>{try{return JSON.parse(localStorage.getItem('king-vandyz-history')||'[]')}catch{return []}})()} setSelected={setSelected} setPage={navigate} clear={()=>{localStorage.removeItem('king-vandyz-history');show('History cleared','success')}}/>;else content=<SettingsPage profile={profile} setProfile={setProfile} siteSettings={siteSettings}/>;
 return <><div className={transition?'page-transition is-leaving':'page-transition'}><Layout page={page} setPage={navigate} search={search} setSearch={setSearch} status={status} profile={profile} onLogout={logout}>{content}</Layout></div><Toast toast={toast}/></>
}
