# 🚀 TARS WARS — Technical Fest Quantum Mission

An immersive, cinematic, *Interstellar*-inspired full-stack sci-fi quiz application engineered for college technical festivals. Participants answer 20 randomized high-caliber technical challenges across computer science to energize a reactive TARS robot, with every question arriving through a signature origami paper-rocket launch transition.

---

## 🌌 Project Vision & Features

1. **Gargantua Black Hole Environment**:
   - Realtime HTML5 Canvas simulation of a spinning supermassive black hole.
   - Dual-ring gravitational lensing (upper and lower warped accretion disks bending over and under the event horizon).
   - Asymmetric relativistic Doppler beaming (brighter blueshifted approaching side, dimmer redshifted receding side).
   - Interactive starfield, cosmic accretion particles, and holographic cockpit HUD reticles.
   - Fully respects `prefers-reduced-motion`.

2. **Reactive Segmented TARS Robot & Energy System**:
   - 4 articulated monolithic titanium slabs modeled after TARS from *Interstellar*.
   - Dot-matrix LCD telemetry display (`STATUS`, `HUMOR: 75%`, `HONESTY: 90%`).
   - Dynamic 20-segment Core Reactor LED conduits that illuminate as energy increases.
   - **Energy Formula**: $\text{Energy \%} = \text{Correct Answers} \times 5$ (0% minimum to 100% maximum).
   - **Celebratory Mechanical Dance**: On correct answers, outer slabs step up and down, reactor flashes ice-cyan, and floating blue-white spark particles burst with synthesized sci-fi chimes.
   - **Collapse & Recovery**: On incorrect or timed-out answers, TARS slumps downward, tilts at $-16^\circ$, dims LEDs, and then smoothly stands back up to ready stance. Earned energy is never subtracted.

3. **Signature Feature: 3D Paper-Rocket Question Transitions**:
   - Component: `src/components/PaperRocketTransition.tsx`.
   - **Phase 1 (Folding)**: The current question card perspective-folds into an origami paper rocket with white facets, blue crease shadows, and cyan thruster glow.
   - **Phase 2 (Launch)**: The paper rocket accelerates upward with curved trajectory and luminous exhaust trail, exiting the top of the viewport.
   - **Phase 3 (Incoming Flight)**: A second white paper rocket enters from beneath the viewport, decelerating as it reaches center screen.
   - **Phase 4 (Unfolding)**: The incoming rocket spreads open its wings, smoothly unfolding into the next question card with staggered option reveal.
   - **Final Question Singularity Launch**: On question 20, the paper rocket launches into the Gargantua black-hole singularity with hyperdrive light trails, smoothly transitioning to the debriefing screen.

4. **Robust Database & Relational Persistence**:
   - Seeded with **60 curated technical questions** across Algorithms, Operating Systems, Computer Networks, Database Systems, Computer Architecture, Cryptography, and AI Systems.
   - When a quiz starts, the backend selects **exactly 20 unique random questions** and saves their ordered sequence.
   - Reconnecting or refreshing automatically restores the in-progress attempt, active question index, score, energy, and remaining server deadline.
   - Options are shuffled uniquely per attempt while preserving secret server-side correct answer mapping.
   - Server-enforced **45-second circular HUD countdown timer**. Timeouts automatically record an unanswered response and advance.
   - Double-click and replay attack protection.

5. **Organizer Flight Command (Admin Dashboard)**:
   - Protected route with JWT token authentication (`POST /api/admin/login`).
   - Question Bank Management: Add, Edit, Delete, Toggle Active/Inactive, Search, Category filter.
   - Bulk Import JSON utility with copyable schema.
   - Re-seed button to restore default questions.
   - Live Attempts Oversight: View all student attempts, scores, and duration.
   - Reset Attempt button: Allows organizers to clear an attempt for students who experienced computer/network failure.
   - Festival Settings: Configurable duplicate-attempt policy (`allow_duplicate_attempts`), leaderboard display mode (`best` vs `first`), and privacy masking.

6. **Deterministic Live Leaderboard**:
   - Real-time rankings fetched from database.
   - Futuristic Top 3 Podium (Gold, Silver, Bronze holographic pedestals).
   - Deterministic tie-breaker:
     1. Highest Score / Energy ($\downarrow$)
     2. Shortest Total Mission Duration ($\uparrow$)
     3. Earliest Completion Timestamp ($\uparrow$)
   - Search filter by roll number and privacy masking option.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind-compatible Vanilla CSS Design System, Lucide React icons, Canvas Confetti.
- **Audio Engine**: Synthesized Web Audio API sound generator (zero external MP3 dependencies; works 100% offline).
- **Backend**: Node.js, Express, TypeScript (`tsx`), CORS, JSON Web Tokens (JWT).
- **Database**: Dual-driver architecture:
  - **SQLite (WAL Mode)**: Default zero-setup local database (`tars_wars.db`) with foreign keys and ACID transactions.
  - **PostgreSQL / Supabase**: Full migration script included (`server/db/supabase-migration.sql`).
- **Testing**: Vitest, Supertest.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=3001
NODE_ENV=development

# Organizer Flight Command Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=interstellar2026
JWT_SECRET=tars_wars_super_secret_quantum_key_2026_matrix

# Quiz Policies
ALLOW_DUPLICATE_ATTEMPTS=false
LEADERBOARD_DISPLAY_MODE=best
MASK_ROLL_NUMBERS=false

# Optional PostgreSQL / Supabase connection (omit to use local SQLite)
# DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

### 4. Seed the Database
Populates the bank with 60 verified technical questions:
```bash
npm run seed
```

### 5. Start Full-Stack Application
Runs both the Express API server (port 3001) and the Vite frontend (port 5173):
```bash
npm run dev
```

Open your browser at:
- **Participant Quiz Arena**: [http://localhost:5173](http://localhost:5173)
- **Flight Command (Organizer Admin)**: Click "FLIGHT COMMAND" in the navbar or navigate directly. (Username: `admin`, Password: `interstellar2026`).

---

## 🧪 Automated Testing

Run the full integration test suite:
```bash
npm test
```
The test suite validates:
- System health and minimum 20 active questions check.
- Randomized 20-question draw per participant.
- Prevention of correct answer leakage in client responses.
- Accurate energy addition (+5% per correct answer) and immunity of earned energy on wrong answers.
- 45s timeout evaluation and zero energy scoring.
- Double-submission and repeated API call prevention.
- Duplicate attempt rejection when `ALLOW_DUPLICATE_ATTEMPTS` is false.
- Admin authentication and question CRUD endpoints.
- Admin attempt reset functionality.

---

## 🗄️ Supabase / PostgreSQL Setup (Optional)

If deploying to Supabase or cloud PostgreSQL:
1. Open your project on [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste and run the contents of [`server/db/supabase-migration.sql`](file:///server/db/supabase-migration.sql).
4. Add your database connection string to `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   ```

---

## 📋 Organizer Guide

1. **Accessing Admin Panel**: Click "FLIGHT COMMAND" on the top navigation bar.
2. **Default Credentials**:
   - Username: `admin`
   - Password: `interstellar2026` *(Change in `.env` before production)*
3. **Managing Questions**:
   - Click "NEW QUESTION" to create custom college fest questions.
   - Use "IMPORT JSON" to bulk-import questions from other fests.
   - Toggle questions active or inactive at any time without server restart.
4. **Assisting Participants**:
   - If a student experiences a hardware failure, navigate to the **PARTICIPANT ATTEMPTS** tab and click **RESET ATTEMPT** beside their roll number to allow a fresh retry.
