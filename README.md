# EDGE AURUM — Complete Website
**edgeaurum.com · Intelligence Beyond the Charts**

---

## What's Built

| File / Folder | Purpose |
|---|---|
| `index.html` | Homepage — hero, live prices, latest news feed, academy CTA |
| `news.html` | News listing — all posts, filter by category, sidebar with live prices |
| `markets.html` | **Full live dashboard** — 8 mini charts, advanced chart, screener, economic calendar |
| `analysis.html` | Deep analysis listing — filter by topic, featured post, sidebar |
| `academy.html` | Course sales page — problem/solution, curriculum accordion, pricing, testimonials, FAQ |
| `admin/index.html` | **CMS interface** at edgeaurum.com/admin — write posts here daily |
| `admin/config.yml` | CMS field definitions — all post fields pre-configured |
| `_news/` | News post .md files live here (created via /admin automatically) |
| `_analysis/` | Analysis post .md files live here (created via /admin automatically) |
| `_layouts/default.html` | Every page wrapper — nav + ticker + footer |
| `_layouts/post.html` | Individual article — paywall, share buttons, related posts, academy CTA |
| `_includes/nav.html` | Navigation with breaking news banner (editable via /admin settings) |
| `_includes/ticker.html` | **TradingView live ticker tape** — Gold, BTC, EUR/USD, DXY, Oil, Silver, GBP, JPY |
| `_includes/footer.html` | Footer with subscribe form + course link |
| `_includes/scripts.html` | CoinGecko (BTC 60s) + Twelve Data (Gold/Forex 5min) live price updater |
| `_includes/subscribe-bar.html` | Email subscription banner (ConvertKit ready) |
| `_data/settings.yml` | **Edit this file** to change: course price, cohort name, Gumroad URL, Telegram URL, banner text |
| `css/style.css` | Complete stylesheet — dark theme, mobile responsive, TradingView overrides |
| `_config.yml` | Jekyll config — site title, URLs, API keys |
| `netlify.toml` | Netlify build settings — auto-configured |
| `Gemfile` | Jekyll dependencies |

---

## Live Data — What Updates Automatically

| Data | Source | Interval | Setup needed |
|---|---|---|---|
| Ticker tape (all assets) | **TradingView** | Real-time, 0 delay | ✅ None — works immediately |
| 8 mini charts | **TradingView** | Real-time, 0 delay | ✅ None — works immediately |
| Advanced chart | **TradingView** | Real-time, 0 delay | ✅ None — works immediately |
| Market screener | **TradingView** | Real-time, 0 delay | ✅ None — works immediately |
| Economic calendar | **TradingView** | Real-time, 0 delay | ✅ None — works immediately |
| BTC/USD price cards | CoinGecko API | Every 60 seconds | ✅ Free, no key needed |
| Gold / EUR/USD / DXY | Twelve Data API | Every 5 minutes | Get free key at twelvedata.com |

---

## Deploy to Netlify (Step by Step)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Edge Aurum — initial build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/edgeaurum.git
git push -u origin main
```

### 2. Connect Netlify
1. Go to **app.netlify.com** → Add new site → Import from GitHub
2. Select your repo
3. Build settings are auto-read from `netlify.toml` — don't change anything
4. Click **Deploy site**
5. Site goes live at `edgeaurum.netlify.app` in ~2 minutes

### 3. Connect edgeaurum.com domain
Netlify dashboard → Domain settings → Add custom domain → `edgeaurum.com`
Then update your DNS: add CNAME `www` → `edgeaurum.netlify.app`

---

## Enable the CMS (One-Time Setup)

1. Netlify dashboard → **Identity** → Enable Identity
2. Identity → Settings → Registration → **Invite only**
3. Identity → Settings → Services → **Enable Git Gateway**
4. Identity → **Invite users** → enter your email
5. Accept the email invite → set your password
6. Visit **edgeaurum.com/admin** and log in ✅

---

## Daily Posting Workflow (2 minutes per post)

1. Go to **edgeaurum.com/admin**
2. Click **📰 Daily News** → **New News Post**
3. Fill in:
   - Headline
   - Alert Level (🔴 High / 🟡 Medium / 🟢 Low)
   - Category (War / Gold / Bitcoin / Forex / Macro / Oil)
   - Asset Impacts (Gold ↑, BTC ↓, etc.)
   - Summary (2–3 sentences for the feed)
   - Full Article (rich text editor — write your analysis)
   - Toggle **Premium?** if you want it paywalled
4. Click **Publish**
5. Netlify rebuilds in ~30 seconds → post is live on edgeaurum.com/news/

---

## Monetization Setup

### Course Sales (Gumroad — recommended)
1. Sign up at **gumroad.com**
2. Create your course product → copy the product URL
3. Open `_data/settings.yml` → set `gumroad_url` to your product URL
4. All "Enroll" buttons across the site now link to your Gumroad checkout

### Email List (ConvertKit — free up to 10,000 subscribers)
1. Sign up at **convertkit.com**
2. Create a form → copy the form ID
3. Open `_data/settings.yml` → set `ck_form_id`
4. Open `_includes/subscribe-bar.html` — the ConvertKit embed activates automatically

### Premium Content Paywall
- When writing a post in /admin, toggle **"Is Premium?"** ON
- The post shows excerpt + first ~300px blurred, then shows paywall with Gumroad link
- No extra plugins needed — built into the post layout

### Telegram Channel
1. Create your Telegram channel
2. Open `_data/settings.yml` → set `telegram_url`
3. Channel link appears in nav, footer, and academy page automatically

---

## Update Settings Without Touching Code

Edit `_data/settings.yml` directly on GitHub (or via /admin → ⚙️ Site Settings):

```yaml
banner_text:  "LIVE: Gold surges as Middle East tensions escalate"
banner_level: "high"           # high / medium / low
gumroad_url:  "https://gumroad.com/l/YOUR_ID"
course_price: "$297"
cohort_name:  "June 2026 Cohort"
spots_left:   14
telegram_url: "https://t.me/edgeaurum"
ck_form_id:   "abc123xyz"
```

Push → Netlify rebuilds → all prices, banners, CTAs update site-wide in 30 seconds.

---

## Add Twelve Data Key (Gold + Forex live prices)
1. Get free key at **twelvedata.com** (2 minutes)
2. Open `_config.yml` → set `twelve_data_key: "YOUR_KEY"`
3. Push to GitHub → done

Gold, EUR/USD, and DXY price cards now update every 5 minutes automatically.

---

*© 2026 EdgeAurum · edgeaurum.com*
