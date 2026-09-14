export const config={api:{bodyParser:false,responseLimit:false}};
export default async function handler(req,res){
res.setHeader('Access-Control-Allow-Origin','*');
res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
res.setHeader('Access-Control-Allow-Headers','*');
if(req.method==='OPTIONS')return res.status(200).end();
var path=req.query.path;
var p=Array.isArray(path)?path.join('/'):(path||'');
var u='https://dashscope.aliyuncs.com/'+p;
var h={};
Object.entries(req.headers).forEach(function(pair){var k=pair[0],v=pair[1];var l=k.toLowerCase();if(l!=='host'&&l!=='origin'&&l!=='referer'&&l!=='x-forwarded-for'&&l!=='x-real-ip')h[k]=v});
try{var body=null;if(req.method!=='GET'&&req.method!=='HEAD'){var ch=[];for await(var c of req)ch.push(typeof c==='string'?Buffer.from(c):c);body=Buffer.concat(ch)}
var r=await fetch(u,{method:req.method,headers:h,body:body||undefined});
res.setHeader('Content-Type',r.headers.get('content-type')||'application/octet-stream');
res.status(r.status);var rd=r.body.getReader();while(true){var result=await rd.read();if(result.done)break;res.write(result.value)}res.end()}catch(e){res.status(502).json({error:e.message})}}