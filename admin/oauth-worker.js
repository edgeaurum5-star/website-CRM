// ═══════════════════════════════════════════════
//  EDGE AURUM — GitHub OAuth Worker
//  Deploy this to Cloudflare Workers (free tier)
//  Set these environment variables in Cloudflare:
//    GITHUB_CLIENT_ID     = your client id
//    GITHUB_CLIENT_SECRET = your client secret
// ═══════════════════════════════════════════════

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://edgeaurum.com',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Step 1 — redirect to GitHub login
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
        state: crypto.randomUUID(),
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`, 302
      );
    }

    // Step 2 — GitHub redirects back here with ?code=
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code', { status: 400 });
      }

      // Exchange code for access token
      const tokenRes = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            client_id:     env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        }
      );

      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;

      if (!token) {
        return new Response('Auth failed', { status: 401 });
      }

      // Send token back to CMS via postMessage
      const html = `<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      console.log("receiveMessage %o", e);
      window.opener.postMessage(
        'authorization:github:success:${JSON.stringify({ token: "${token}", provider: "github" }).replace(/"/g, '\\"')}',
        e.origin
      );
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
<p>Authorizing...</p>
</body>
</html>`;

      // Build HTML with actual token
      const finalHtml = `<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:' + JSON.stringify({
          token: "${token}",
          provider: "github"
        }),
        e.origin
      );
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
<p>Authorizing, please wait...</p>
</body>
</html>`;

      return new Response(finalHtml, {
        headers: {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': 'https://edgeaurum.com',
        }
      });
    }

    return new Response('Edge Aurum OAuth Worker', { status: 200 });
  }
};
