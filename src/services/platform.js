import {db,rpc,getSession,profile} from './supabase';

export async function getMyProfile(){const s=getSession(); if(!s?.access_token)return null; try{await rpc('sync_access_state',{},s.access_token)}catch{} return profile(s.access_token)}
export async function touchPresence(){try{await rpc('touch_presence',{},getSession()?.access_token)}catch{}}
export async function consumeTool(toolId,cost=10){
  const token=getSession()?.access_token; if(!token)throw new Error('Session expired.');
  try{return await rpc('consume_tool',{p_tool_id:toolId,p_cost:cost},token)}catch(e){try{return await rpc('consume_tool_v2',{p_tool_id:toolId,p_cost:cost},token)}catch{throw new Error('Credits tidak cukup atau tool tidak dapat digunakan.')}}
}
export async function getPublicStats(){try{return await rpc('public_stats',{},getSession()?.access_token)}catch{return null}}
export async function getAdminStats(){try{return await rpc('admin_stats',{},getSession()?.access_token)}catch{return null}}
export async function listRows(table,query='?select=*'){return db(table,{token:getSession()?.access_token,query})}
export async function mutate(table,method,body,query=''){return db(table,{token:getSession()?.access_token,method,body,query,prefer:'return=representation'})}
export async function adminRpc(name,args){return rpc(name,args,getSession()?.access_token)}
export async function createOrder(product,price,credits=0,vip_days=0){return adminRpc('create_order',{p_product:product,p_price:Number(price),p_credits:Number(credits),p_vip_days:Number(vip_days)})}
