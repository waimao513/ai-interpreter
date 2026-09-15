exports.handler = async function(event) {
  var cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "*"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors, body: "" };
  }

  try {
    var path = (event.queryStringParameters && event.queryStringParameters.path) || "";
    var target = "https://dashscope.aliyuncs.com/" + path;

    var headers = {};
    if (event.headers.authorization) {
      headers["Authorization"] = event.headers.authorization;
    }
    if (event.headers["content-type"]) {
      headers["Content-Type"] = event.headers["content-type"];
    }

    var fetch = globalThis.fetch;
    var opts = { method: event.httpMethod, headers: headers };
    if (event.httpMethod === "POST" && event.body) {
      opts.body = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body;
    }

    var resp = await fetch(target, opts);
    var buffer = Buffer.from(await resp.arrayBuffer());

    return {
      statusCode: resp.status,
      headers: Object.assign({
        "Content-Type": resp.headers.get("content-type") || "application/json"
      }, cors),
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: Object.assign({ "Content-Type": "application/json" }, cors),
      body: JSON.stringify({ error: e.message })
    };
  }
};
