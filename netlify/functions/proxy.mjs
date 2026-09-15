export default async (request) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("path") || "";
    const target = "https://dashscope.aliyuncs.com/" + path;

    const headers = {};
    const auth = request.headers.get("authorization");
    const ct = request.headers.get("content-type");
    if (auth) headers["Authorization"] = auth;
    if (ct) headers["Content-Type"] = ct;

    const opts = { method: request.method, headers: headers };

    if (request.method === "POST") {
      opts.body = await request.arrayBuffer();
    }

    const resp = await fetch(target, opts);
    const respHeaders = new Headers(resp.headers);
    respHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(resp.body, {
      status: resp.status,
      headers: respHeaders,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
};
