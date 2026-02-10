# 🎲 Turism — Romanian Monopoly Online

An online multiplayer implementation of **Turism**, the classic Romanian board game from the communist era — essentially Monopoly adapted to 1980s Romania, with real Romanian cities and tourist destinations.

## Features (Phase 1)

- **Room system** — create or join games with a 5-letter room code
- **Turn-based gameplay** — server enforces turn order, no cheating possible
- **Server-authoritative dice** — rolls happen on the server, not the client
- **Buy properties** — land on unowned properties and buy them
- **Pay rent** — land on someone else's property and pay rent
- **Pass Go bonus** — collect $200 when passing Start
- **Surprise cards** — random money gain/loss effects
- **Doubles mechanic** — roll doubles to go again
- **Bankruptcy & win detection** — game ends when one player remains
- **Game log** — all actions logged in real-time
- **Real-time multiplayer** — Socket.IO for instant state sync

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | pnpm workspaces |
| **Frontend** | React 18, Vite 5, TypeScript, Tailwind CSS 3 |
| **Backend** | Node.js, Express, Socket.IO 4, TypeScript |
| **Shared** | TypeScript types & game data (tiles, constants) |
| **Deploy** | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
turism-game/
├── packages/shared/        # Shared types, tile data, constants
│   ├── types.ts            # Player, GameState, socket events, constants
│   ├── tiles.ts            # 40 board tiles with rent tables
│   └── index.ts
├── apps/server/            # Authoritative game server
│   ├── index.ts            # Express + Socket.IO, room management
│   └── GameRoom.ts         # All game logic (dice, buying, rent, turns)
├── apps/client/            # React frontend
│   ├── App.tsx             # Router: Home → Lobby → Game
│   ├── Lobby.tsx           # Room code, player list, start button
│   ├── Game.tsx            # Main game screen with board + controls
│   ├── Board.tsx           # CSS Grid board rendering
│   ├── Dice.tsx            # Dice display + roll animation
│   ├── GameLog.tsx         # Scrollable event log
│   ├── useSocket.ts        # Socket.IO hook with typed events
│   ├── tileLayout.ts       # Grid coordinates for each tile
│   └── public/             # Dice SVGs + 25 property images
├── render.yaml             # Render deploy config (server)
└── pnpm-workspace.yaml
```

---

## Local Development

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8 (`npm install -g pnpm`)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/radutheodor/turism-game.git
cd turism-game

# 2. Install all dependencies
pnpm install

# 3. Start both server and client
pnpm dev
```

Or start them separately in two terminals:

```bash
# Terminal 1 — Server (port 3001)
pnpm dev:server

# Terminal 2 — Client (port 5173)
pnpm dev:client
```

Open **http://localhost:5173** in your browser.
To test multiplayer locally, open 2+ browser tabs.

### Environment Variables

The client connects to `http://localhost:3001` by default in dev mode. To override, create `apps/client/.env.local`:

```
VITE_BACKEND_URL=http://localhost:3001
```

---

## Deployment

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` and creates the service
5. Note the deployed URL (e.g. `https://turism-server.onrender.com`)

**Manual setup** (if not using Blueprint):
- **Type**: Web Service
- **Root Directory**: `apps/server`
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Environment**: Node
- **Env var**: `PORT` = `3001`

> ⚠️ Render free tier sleeps after 15 min of inactivity. First request takes ~30s to wake up.

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/client`
   - **Build Command**: `cd ../.. && pnpm install && pnpm --filter client build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm i -g pnpm && pnpm install`
4. Add environment variable:
   - `VITE_BACKEND_URL` = `https://turism-server.onrender.com` (your Render URL)
5. Deploy

> **Important**: Set the `VITE_BACKEND_URL` env var in Vercel dashboard to point to your Render backend URL. Without this, the client won't know where the server is.

### After deploying both:

1. Deploy the **server on Render** first — note the URL
2. Set that URL as `VITE_BACKEND_URL` in **Vercel environment variables**
3. Deploy (or redeploy) the **client on Vercel**
4. Open the Vercel URL → Create a game → Share the room code!

---

## How to Play

1. Open the app and enter your name + choose a token emoji
2. **Create** a new game (you become the host) or **Join** with a room code
3. Share the room code with friends (up to 6 players)
4. Host clicks **Start Game** when everyone has joined
5. On your turn:
   - Click **Roll Dice** — dice are rolled on the server
   - If you land on an unowned property → **Buy** or **Pass**
   - If you land on someone's property → rent is paid automatically
   - If you roll doubles → you get another turn!
   - Click **End Turn** when done
6. Last player standing wins! 🏆

---

## What's Next (Phase 2+)

- [ ] Mortgage/unmortgage properties
- [ ] Build cabins and hotels
- [ ] Full Surprise card deck with specific effects
- [ ] Semafor (jail) mechanics
- [ ] CFR/Station transport mechanics
- [ ] Trading between players
- [ ] Spectator mode
- [ ] Chat
- [ ] Sound effects & enhanced animations
- [ ] Mobile-responsive layout
