export const config={api:{bodyParser:false}};

const BASE=process.env.API_BASE_URL||'https://api.zyvor.my.id';
const BLOCKED=/(porn|nsfw|xxx|sexual|adult[-_ ]?content|malware|ransomware|phish|gambl|casino|bet|judi|weapon|drug)/i;
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));}
function decode(value){try{return decodeURIComponent(String(value||''))}catch{return String(value||'')}}
function pathFrom(req){let raw=Array.isArray(req.query?.path)?req.query.path.join('/'):req.query?.path||'';raw=decode(raw);if(!raw.startsWith('/'))raw='/'+raw;if(!raw.startsWith('/api/'))raw='/api/'+raw.replace(/^\/+/,'');return raw;}
async function body(req){const chunks=[];for await(const c of req)chunks.push(c);return chunks.length?Buffer.concat(chunks):null;}
function appendQuery(url,search){if(!search)return;const sp=new URLSearchParams(search);for(const [k,v] of sp)url.searchParams.append(k,v)}
export default async function handler(req,res){
  const rawPath=pathFrom(req); let parsed;
  try{parsed=new URL(rawPath,'http://proxy.local')}catch{return json(res,400,{success:false,error:'Invalid endpoint path.'})}
  const pathname=parsed.pathname;
  if(!/^\/api\/[A-Za-z0-9._~!$&'()*+,;=:@%/?-]+$/.test(pathname)||BLOCKED.test(pathname))return json(res,403,{success:false,error:'Endpoint unavailable.'});
  const method=(req.method||'GET').toUpperCase();
  const url=new URL(BASE.replace(/\/$/,'')+pathname); appendQuery(url,parsed.search);
  for(const [k,v] of Object.entries(req.query||{})){if(k==='path'||v==null)continue;for(const x of(Array.isArray(v)?v:[v]))url.searchParams.append(k,String(x))}
  const raw=await body(req); const headers={Accept:req.headers?.accept||'application/json, text/plain, */*','User-Agent':'KING-VANDYZ-Zyyvor/3.0'};
  if(req.headers?.['content-type'])headers['Content-Type']=req.headers['content-type'];
  const init={method,headers}; if(!['GET','HEAD'].includes(method)&&raw)init.body=raw;
  try{
    const r=await fetch(url,{...init,signal:AbortSignal.timeout(50000)});
    const ct=r.headers.get('content-type')||'application/octet-stream'; const buf=Buffer.from(await r.arrayBuffer());
    res.statusCode=r.status;res.setHeader('Content-Type',ct);res.setHeader('Cache-Control','no-store');res.setHeader('X-KING-VANDYZ-Upstream',BASE);res.end(buf);
  }catch(e){json(res,502,{success:false,error:'Zyyvor upstream unreachable.',detail:e?.message||'network error'});}
}
