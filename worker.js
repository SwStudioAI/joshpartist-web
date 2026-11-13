// Canonicalización: una sola versión pública del sitio.
// http:// y www.* redirigen 301 a https://joshpartist.com (misma ruta y query).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isGet = request.method === "GET" || request.method === "HEAD";
    if (isGet && (url.protocol === "http:" || url.hostname.startsWith("www."))) {
      url.protocol = "https:";
      url.hostname = url.hostname.replace(/^www\./, "");
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
