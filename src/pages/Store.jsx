import React from 'react';
import {ShoppingBag, Zap, Crown, MessageCircle, ArrowUpRight, ShieldCheck} from 'lucide-react';
import {createOrder} from '../services/platform';

const products=[
 {id:'credits-500',product:'500 Credits',credits:500,price:10000,normal:20000,tag:'POPULAR',desc:'500 purchased credits. Never expires.'},
 {id:'credits-1000',product:'1000 Credits',credits:1000,price:15000,normal:40000,tag:'BEST VALUE',desc:'1000 purchased credits for heavy tool usage.'},
 {id:'vip-1m',product:'VIP 1 Month',vip_days:30,price:15000,tag:'UNLIMITED',desc:'Unlimited tool usage while VIP is active.'}
];

export default function Store({profile}){
 const [busy,setBusy]=React.useState(''); const [created,setCreated]=React.useState(null); const [error,setError]=React.useState('');
 const buy=async p=>{if(!profile){setError('Login terlebih dahulu untuk membuat order.');return}setBusy(p.id);setError('');try{const o=await createOrder(p.product,p.price,p.credits||0,p.vip_days||0);setCreated({...o,p});}catch(e){setError(e?.message||'Order gagal dibuat.')}finally{setBusy('')}};
 const wa=created?`https://wa.me/6283818597706?text=${encodeURIComponent(`KING VANDYZ ORDER\n\nOrder ID: ${created.id}\nUsername: ${profile.username}\nProduct: ${created.product}\nPrice: Rp${Number(created.price).toLocaleString('id-ID')}`)}`:'#';
 return <div className="page store-page">
  <section className="store-hero"><div><small>VANDYZ STORE</small><h1>Power your<br/><em>toolbox.</em></h1><p>Purchase credits or activate VIP. Orders are recorded in Supabase before you continue to WhatsApp.</p></div><div className="store-orb"><ShoppingBag size={42}/><span>REAL ORDERS</span></div></section>
  {error&&<div className="error-banner">{error}</div>}
  <section className="store-grid">{products.map(p=><article className={`store-card ${p.id==='vip-1m'?'vip-store':''}`} key={p.id}>
   <div className="store-card-top"><span className="store-tag">{p.tag}</span>{p.id==='vip-1m'?<Crown/>:<Zap/>}</div>
   <h2>{p.product}</h2><p>{p.desc}</p>
   <div className="store-price">{p.normal&&<del>Rp{p.normal.toLocaleString('id-ID')}</del>}<strong>Rp{p.price.toLocaleString('id-ID')}</strong>{p.vip_days&&<span>/ 30 days</span>}</div>
   <button className="btn primary store-buy" disabled={busy===p.id} onClick={()=>buy(p)}>{busy===p.id?'Creating order…':'Buy now'} <ArrowUpRight size={16}/></button>
   <small className="store-note"><ShieldCheck size={14}/> {p.vip_days?'Unlimited usage while active':'Credits never expire'}</small>
  </article>)}</section>
  <section className="store-process"><div><small>HOW IT WORKS</small><h2>Order first. Pay through WhatsApp.</h2></div><div className="process-steps"><span><b>01</b>Create order</span><span><b>02</b>Receive Order ID</span><span><b>03</b>Confirm via WhatsApp</span><span><b>04</b>Admin completes order</span></div></section>
  {created&&<div className="modal-backdrop"><div className="order-modal"><button className="modal-close" onClick={()=>setCreated(null)}>×</button><small>ORDER CREATED</small><h2>{created.product}</h2><div className="order-id">{created.id}</div><p>Jangan menekan tombol WhatsApp sebelum memastikan detail order sudah benar.</p><a className="btn primary" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Continue to WhatsApp</a></div></div>}
 </div>
}
