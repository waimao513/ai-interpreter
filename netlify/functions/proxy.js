exports.handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors, body: "" };
  }

  try {
    const path = (event.queryStringParameters && event.queryStringParameters.path) || "";
    const target = "https://dashscope.aliyuncs.com/" + path;

    const headers = {};
    if (event.headers.authorization) headers["Authorization"] = event.headers.authorization;
    if (event.headers["content-type"]) headers["Content-Type"] = event.headers["content-type"];

    const opts = { method: event.httpMethod, headers: headers };
    if (event.httpMethod === "POST" && event.body) {
      opts.body = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body;
    }

    const resp = await fetch(target, opts);
    const data = await resp.arrayBuffer();

    return {
      statusCode: resp.status,
      headers: Object.assign({ "Content-Type": resp.headers.get("content-type") || "application/json" }, cors),
      body: Buffer.from(data).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: Object.assign({ "Content-Type": "application/json" }, cors),
      body: JSON.stringify({ error: e.message }),
    };
  }
};
