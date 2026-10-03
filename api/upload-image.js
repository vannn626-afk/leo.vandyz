export const config={api:{bodyParser:false}};
const UPLOAD_URL=process.env.TEMP_UPLOAD_URL||'https://tmpfiles.org/api/v1/upload';
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));}
async function body(req){const chunks=[];for await(const c of req)chunks.push(c);return chunks.length?Buffer.concat(chunks):Buffer.alloc(0);}
function directUrl(url){if(!url)return null;try{const u=new URL(url);if(u.hostname==='tmpfiles.org'&&u.pathname.startsWith('/')&&!u.pathname.startsWith('/dl/'))u.pathname='/dl'+u.pathname;return u.toString()}catch{return url}}
export default async function handler(req,res){
 if(req.method!=='POST')return json(res,405,{success:false,error:'POST only'});
 const ct=req.headers?.['content-type']||'';
 if(!ct.toLowerCase().startsWith('multipart/form-data'))return json(res,400,{success:false,error:'Send the image as multipart/form-data.'});
 try{const raw=await body(req);const r=await fetch(UPLOAD_URL,{method:'POST',headers:{'Content-Type':ct,'User-Agent':'KING-VANDYZ image uploader/1.0'},body:raw,signal:AbortSignal.timeout(60000)});const text=await r.text();if(!r.ok)return json(res,502,{success:false,error:'Temporary upload service rejected the image.',detail:text.slice(0,500)});let data;try{data=JSON.parse(text)}catch{data={raw:text}};const candidate=data?.data?.url||data?.data?.download_url||data?.url||data?.files?.[0]?.url||data?.file?.url;const url=directUrl(candidate);if(!url)return json(res,502,{success:false,error:'Upload succeeded but no direct URL was returned.'});return json(res,200,{success:true,url,temporary:true,provider:'tmpfiles'});}catch(e){return json(res,502,{success:false,error:'Temporary image upload failed.',detail:e?.message||'network error'});}
}
