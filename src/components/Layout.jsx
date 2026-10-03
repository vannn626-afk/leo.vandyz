import React from 'react';
import {
  Home, Grid2X2, Settings, Search, Menu, X, Heart, Clock3, Activity,
  UserRound, LayoutDashboard, ShoppingBag, ShieldCheck, LogOut, Info,
  MoreHorizontal, ReceiptText, Sparkles
} from 'lucide-react';

const MAIN_NAV = [
  ['home','Home',Home],
  ['tools','Tools',Grid2X2],
  ['store','Store',ShoppingBag],
  ['about','About',Info],
  ['profile','Account',UserRound],
];

const ACCOUNT_NAV = [
  ['dashboard','Dashboard',LayoutDashboard],
  ['orders','Orders',ReceiptText],
  ['profile','Account',UserRound],
  ['favorites','Favorites',Heart],
  ['history','History',Clock3],
  ['settings','Settings',Settings],
];

export default function Layout({children,page,setPage,search,setSearch,status,profile,onLogout}){
  const [open,setOpen]=React.useState(false);
  const go=id=>{setPage(id);setOpen(false)};
  const currentLabel = [...MAIN_NAV,...ACCOUNT_NAV,['admin','Control Center',ShieldCheck]].find(x=>x[0]===page)?.[1] || page;

  return <div className="app-shell">
    <header className="mobile-header glass-nav">
      <button className="icon-btn nav-menu-btn" onClick={()=>setOpen(v=>!v)} aria-label="Open navigation" aria-expanded={open}>
        {open?<X/>:<Menu/>}
      </button>
      <button className="brand mobile-brand" onClick={()=>go('home')} aria-label="KING VANDYZ Home">
        KING <span>VANDYZ</span>
      </button>
      <button className="mobile-status" onClick={()=>go(profile?'profile':'login')} aria-label={profile?'Open account':'Login'}>
        {profile?<UserRound size={18}/>:<Sparkles size={18}/>}<span className="live-dot"/>
      </button>
    </header>

    <aside className={`sidebar app-rail ${open?'open':''}`}>
      <div className="rail-brand">
        <button className="brand rail-brand-btn" onClick={()=>go('home')} aria-label="KING VANDYZ Home">
          <span className="brand-k">K</span><span className="brand-full">KING <b>VANDYZ</b></span>
        </button>
      </div>

      <nav className="rail-main" aria-label="Primary navigation">
        {MAIN_NAV.map(([id,label,I])=><button key={id} title={label} aria-label={label} className={page===id?'active':''} onClick={()=>go(id)}>
          <I size={20}/><span>{label}</span>
        </button>)}
      </nav>

      <div className="rail-divider"/>
      <nav className="rail-account" aria-label="Account navigation">
        {profile && ACCOUNT_NAV.filter(([id])=>id!=='profile').map(([id,label,I])=><button key={id} title={label} aria-label={label} className={page===id?'active':''} onClick={()=>go(id)}>
          <I size={18}/><span>{label}</span>
        </button>)}
        {String(profile?.role||'').toUpperCase()==='ADMIN'&&<button title="Control Center" aria-label="Control Center" className={page==='admin'?'active':''} onClick={()=>go('admin')}><ShieldCheck size={18}/><span>Admin</span></button>}
      </nav>

      <div className="rail-bottom">
        <div className="rail-status"><span className="live-dot"/><span>LIVE</span></div>
        {profile ? <button className="rail-user" onClick={()=>go('profile')} title={`@${profile.username}`}>
          <span className="avatar-mini"><UserRound size={15}/></span><span className="rail-user-text"><b>@{profile.username}</b><small>{profile.role?.toUpperCase()}</small></span>
        </button> : <button className="rail-login" onClick={()=>go('login')}><UserRound size={16}/><span>Login</span></button>}
      </div>
    </aside>

    {open && <button className="nav-scrim" aria-label="Close navigation" onClick={()=>setOpen(false)}/>} 
    <div className={`mobile-drawer ${open?'open':''}`}>
      <div className="drawer-head"><div><small>NAVIGATION</small><b>KING VANDYZ</b></div><button className="icon-btn" onClick={()=>setOpen(false)} aria-label="Close navigation"><X/></button></div>
      <div className="drawer-section"><small>EXPLORE</small>{MAIN_NAV.map(([id,label,I])=><button key={id} className={page===id?'active':''} onClick={()=>go(id)}><I/><span>{label}</span></button>)}</div>
      {profile&&<div className="drawer-section"><small>YOUR SPACE</small>{ACCOUNT_NAV.filter(([id])=>id!=='profile').map(([id,label,I])=><button key={id} className={page===id?'active':''} onClick={()=>go(id)}><I/><span>{label}</span></button>)}</div>}
      {String(profile?.role||'').toUpperCase()==='ADMIN'&&<div className="drawer-section"><small>ADMIN</small><button className={page==='admin'?'active':''} onClick={()=>go('admin')}><ShieldCheck/><span>Control Center</span></button></div>}
      <div className="drawer-footer">{profile?<button onClick={onLogout}><LogOut/><span>Logout</span></button>:<button onClick={()=>go('login')}><UserRound/><span>Login / Register</span></button>}</div>
    </div>

    <main className="main">
      <div className="topbar">
        <div className="topbar-brand"><span className="topbar-mark">K</span><div><b>KING VANDYZ</b><small>API WORKSPACE</small></div></div>
        <nav className="desktop-nav" aria-label="Desktop navigation">
          {[...MAIN_NAV.slice(0,4),['settings','Settings',Settings]].map(([id,label,I])=><button key={id} className={page===id?'active':''} onClick={()=>go(id)}><I size={15}/><span>{label}</span></button>)}
          <button className={page==='profile'?'active':''} onClick={()=>go(profile?'profile':'login')}><UserRound size={15}/><span>{profile?'Account':'Login'}</span></button>
        </nav>
        <label className="global-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tools, APIs, downloaders..."/><kbd>/</kbd></label>
      </div>
      {children}
    </main>

    <nav className="bottom-nav glass-nav" aria-label="Mobile navigation">
      {[
        ['home','Home',Home],
        ['tools','Tools',Grid2X2],
        ['store','Store',ShoppingBag],
        ['settings','Settings',Settings],
        ['profile',profile?'Account':'Login',UserRound]
      ].map(([id,label,I])=><button key={id} className={page===id?'active':''} onClick={()=>go(id==='profile'&&!profile?'login':id)} aria-label={label}>
        <span className="bottom-icon"><I size={19}/>{id==='store'&&<em>+</em>}</span><small>{label}</small>
      </button>)}
    </nav>
  </div>
}
