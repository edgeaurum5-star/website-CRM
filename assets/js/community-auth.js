// ═══════════════════════════════════════
// Edge Aurum — Community Login Widget
// Requires: Supabase project (see community-accounts-setup.md)
// ═══════════════════════════════════════

const SUPABASE_URL = "https://xmgojcskzezfoylccfkx.supabase.co";       // e.g. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_gsnVQbwIIFH3SzBPB-S0-w_7Tt0RRwN";     // the public "anon" key, safe to expose

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const el = (id) => document.getElementById(id);

async function refreshMemberCount() {
  const { count } = await sb
    .from("profiles")
    .select("*", { count: "exact", head: true });
  const countEl = el("mem-count");
  if (countEl && typeof count === "number") {
    countEl.textContent = count.toLocaleString();
  }
}

async function loadRecentJoiners() {
  const { data } = await sb
    .from("profiles")
    .select("username, created_at")
    .order("created_at", { ascending: false })
    .limit(6);
  const wrap = el("mem-recent");
  if (!wrap) return;
  if (!data || data.length === 0) {
    wrap.innerHTML = "";
    return;
  }
  wrap.innerHTML = data
    .map((p) => `<span class="mem-chip">${escapeHtml(p.username)}</span>`)
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function renderAuthState() {
  const { data: { session } } = await sb.auth.getSession();

  const loggedOutBox = el("mem-logged-out");
  const usernameBox = el("mem-set-username");
  const welcomeBox = el("mem-welcome");

  if (!session) {
    loggedOutBox.style.display = "block";
    usernameBox.style.display = "none";
    welcomeBox.style.display = "none";
    return;
  }

  // Logged in — check if they already have a username
  const { data: profile } = await sb
    .from("profiles")
    .select("username, created_at")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profile && profile.username) {
    loggedOutBox.style.display = "none";
    usernameBox.style.display = "none";
    welcomeBox.style.display = "flex";
    el("mem-welcome-name").textContent = profile.username;
    const joined = new Date(profile.created_at);
    el("mem-welcome-date").textContent = joined.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } else {
    loggedOutBox.style.display = "none";
    usernameBox.style.display = "block";
    welcomeBox.style.display = "none";
  }
}

// ── Send magic link ──
el("mem-login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = el("mem-email").value.trim();
  const status = el("mem-login-status");
  status.textContent = "Sending link…";
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + "/community/" },
  });
  status.textContent = error
    ? "Something went wrong — try again."
    : "Check your email for a login link.";
});

// ── Save chosen username ──
el("mem-username-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = el("mem-username").value.trim();
  const status = el("mem-username-status");

  if (username.length < 3) {
    status.textContent = "Username must be at least 3 characters.";
    return;
  }

  const { data: { session } } = await sb.auth.getSession();
  if (!session) return;

  status.textContent = "Saving…";
  const { error } = await sb
    .from("profiles")
    .insert({ id: session.user.id, username });

  if (error) {
    status.textContent = error.message.includes("duplicate")
      ? "That username is taken — try another."
      : "Something went wrong — try again.";
    return;
  }

  status.textContent = "";
  await renderAuthState();
  await refreshMemberCount();
  await loadRecentJoiners();
});

// ── Sign out ──
el("mem-signout")?.addEventListener("click", async () => {
  await sb.auth.signOut();
  await renderAuthState();
});

// ── Init ──
sb.auth.onAuthStateChange(() => {
  renderAuthState();
});

renderAuthState();
refreshMemberCount();
loadRecentJoiners();
