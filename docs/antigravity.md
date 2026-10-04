# Rebuild LOCANO from scratch

You are Antigravity. Build this website as a new project. You do not have the old repository, and you must not ask for it. Everything required to recreate the product is in this file. The bus list and the search code at the bottom are the source of truth. Paste those files in unchanged. Write the pages and the visual layout yourself so they match the rules below.

Do not add a database, a login server, live bus positions, payments, or extra products. Do not invent bus clocks.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 and shadcn/ui for buttons, dialogs, sheets, and inputs
- Leaflet and react-leaflet for the route map
- Fonts from `next/font/google`: Outfit for interface text, Fraunces as an optional display face
- Import the class helper with `import { cn } from "cn"`
- No environment variables. The app must run with `npm install` and `npm run dev` and open at `http://localhost:3000`

Create the app, then add the files in the appendix at the exact paths named there.

## Product

LOCANO helps students and newcomers in Mangaluru find a city bus. Transport search works. Accommodation, food, jobs, and emergency help are labels only.

A person can search two places, search a bus number, read the stops on that ride, see an estimated duration and an indicative fare, browse the full route table, ask the browser for the nearest listed stop, and keep recent searches on this device.

A person cannot see a moving bus, a real timetable, or a saved password. Accounts are a waitlist stored in the browser.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Three full-screen sections: `#hero`, `#routes`, `#about` |
| `/transport` | The route directory with the title as an `h1` |
| `/transport/bus/[id]` | One road of one bus. `?from=&to=` limits the view to that segment |
| `/transport/stop/[slug]` | One stop and every bus whose stop list contains it |
| `/transport/route/[fromId]-to-[toId]` | Results between two stop ids. Split on the first `-to-` |
| `/transport/near` | Nearest stops from browser geolocation. If permission is denied, say so and do not invent a location |
| `/about` | The same story as the home About section |
| `/privacy` | The waitlist stays in this browser. Passwords are not stored |
| `/terms` | A password is checked only against a contact already saved in this browser, then thrown away |
| `/login` and `/signup` | Both open the account card. They do not create a server session |

Title: `LOCANO — Mangaluru transport`. Inner pages use `%s · LOCANO`.

## Home

Hero, keep this copy:

- Small label: `LOCANO TRANSPORT`
- Title lines: `Find Your Bus.` / `Reach Anywhere` / `in Mangaluru.`
- The last line is `#1f6fe5`
- Line under the title: `Search bus routes, bus numbers and real-time updates in seconds.`
- That line is advertising copy. Do not build a live feed.

Hero background is a full-bleed photo at `/hero-coast.png` (a city bus on the Mangaluru coast, lighthouse and beach). If the photo is missing, use a full-viewport wash of `#d7e7f6` and keep the layout. Do not block the build on the image.

The search bar sits on the lower part of the hero.

Location search:

- From and To. Suggestions start at 1 character, maximum 8.
- One letter means “name or alias starts with this letter”. The letter `v` must list V. Gorigudda, Valachil, Valencia, Vamanjoor, Veeranagar, Vishranthi Church, and Vishwabhavan.
- Choosing a suggestion stores that stop id. Editing the text clears the stored id.
- Swap exchanges the two fields.
- Submit opens `/transport/route/{fromId}-to-{toId}` and saves a recent search.
- Missing field: `Enter both a starting point and a destination.`
- Shared display name, such as Kaikamba or Kapikad: `A couple of places share that name. Pick one from the suggestions.`
- Unknown place: `Those names are not in the stop list yet. Pick a place from the suggestions.`
- Same place twice: `Pick two different places.`

Bus-number search:

- Exact number first. If none, numbers that start with the query.
- When one number has two roads, list both. Do not open a page automatically.
- One match opens `/transport/bus/{id}`.
- `getBus` in the appendix matches the route id before the public number. `1B` is stored twice, as ids `1b` and `1b-2`.

Routes section:

- Label `Transport`, title `All Bus Routes`.
- Filters, in order: All Areas, Redirected, City, Kankanady, Bejai, Deralakatte, Ullal, Surathkal, Attavar, Others.
- Redirected: the public number has more than one road.
- City: the route serves a central area (Hampankatta, Balmatta, Kadri, Falnir, Bunder, Kudroli, Boloor, Mangaladevi, Lalbagh, Lady Hill, Mannagudda, Bendoorwell, Nandigudda, Jeppu) and does not serve Deralakatte, Konaje, Ullal, Surathkal, Mukka, Katipalla, Krishnapur, or Bajpe.
- Kankanady includes Pumpwell. Deralakatte includes Konaje. Surathkal includes Mukka, Katipalla, and Krishnapur.
- Others: none of Kankanady, Bejai, Deralakatte, Ullal, Surathkal, or Attavar.
- Five routes per page. Show number, start → end, key stops, and fleet. A null fleet is an em dash.
- Place chips: Yenepoya (Deemed University) uses stop id `deralakatte`, then Mangalore University (`mangalagangothri`), Kankanady, Bejai, Surathkal, Ullal, Airport (`bajpe-airport`), Katipalla.

About section:

- Label `About`, title `LOCANO`, line `Settling made simple`.
- Paragraph: `LOCANO is a student-focused platform that brings together essential services to help you settle, explore and live comfortably in Mangalore.`
- Photo `/about-students.png` on the right on large screens, with a white curve along its left edge. If the file is missing, leave the space empty. The photo must not cover the cards.
- Heading `Everything a Student Needs`.
- Six cards, only Transport links to `/transport`:
  - Accommodation — Verified PGs and hostels near your college. Tint `#e8f1ff` / `#1f6fe5`
  - Food & Mess — Affordable and reliable food options. Tint `#fff1e8` / `#f97316`
  - Transport — Bus routes, timings and key stops. Tint `#f3e8ff` / `#7c3aed`
  - Part-time Jobs — Local opportunities for students. Tint `#e9f9ef` / `#16a34a`
  - Emergency — Important contacts and quick support. Tint `#ffe8ea` / `#ef4444`
  - More Services — All essential student needs in one place. Tint `#fff6d8` / `#e0a100`
- A Coming Soon band: the full platform with those services is not built.

Home scroll snaps between `#hero`, `#routes`, and `#about` on wheel, touch, and arrow keys when the reader is near the edge of a screen. Duration 880ms. Easing is `1 - (1 - t) ** 4`. The snap only calls `window.scrollTo`. Inside a tall screen, the page scrolls normally.

## Chrome

Fixed navbar. On the hero, show the logo. Away from the hero, hide it. Links: Home, Routes, About, search, and Sign In. Search opens a modal with the same place and number search. Sign In opens the account card.

Inner pages need top padding so the fixed bar does not cover the content.

Footer background `#041422`. Links: Find a bus (`/transport`), Stops near you (`/transport/near`), Balmatta to Yenepoya (`/transport/route/balmatta-to-deralakatte`).

## Results and a single bus

Build results with `resultCards` from the appendix.

- Direct rides first. A place within 0.35 km of the straight segment between two chart stops still counts, except the first and last 5 percent of that segment. Mark those as along the road.
- Then nearby alternatives: up to two nearest other stops around each end.
- Sort direct rides by along-road last, then fewer minutes, then fewer stops, then bus number.
- Filters: All Buses, Direct Buses, Nearby Stops.
- Sorts: time, number, fleet.
- Each card links to `/transport/bus/{id}?from={fromId}&to={toId}`.

The bus page is a stop-by-stop list with estimated minutes, indicative fare, fleet, and the other road when the number is redirected. Do not show a departure time or an arrival time.

Fare, already implemented in the appendix: `max(10, round((8 + km * 1.6) / 2) * 2)` rupees. Call it indicative and tell the reader to confirm the bus before boarding.

## Account card

Email or Indian mobile. Default country code `+91`. A `+91` number must match `^[6-9]\d{9}$`. Any other code needs at least 6 digits. Password length is at least 8 characters. On submit, clear the password immediately. Store only the contact in `localStorage` under `locano.waitlist`. Sign-in does not create a session. If that contact is already stored, say sign-in starts when accounts open. Google is a button that says sign-in is not connected. After a successful create, offer a way to open `/transport`.

Recent searches use `localStorage` key `locano.recent`, at most 6, through the appendix file.

## Look

Light page, not a dark site.

- Text `#10233f` and `#0d1b33`
- Blue `#1f6fe5`
- Hero wash `#d7e7f6`
- Routes background `#f4f7fb`
- Results background `#f4f8fc`
- About background white
- White cards, large radius, shadow about `0 8px 24px rgba(16, 40, 80, 0.04)`
- Navbar: fixed, centered, pill shaped, white at about 80 percent opacity with a blur
- Search fields and main buttons: fully rounded
- Usable on a phone. The route table may scroll sideways.

## Motion

After something has appeared, it stays fully opaque. Do not fade, blur, shrink, or hide cards because of the scroll position.

Allowed:

- One entrance when an element first intersects the viewport: opacity 0 to 1 and 20px upward, about 620ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`. Then leave opacity at 1 and transform at rest. Do not update those styles on later scroll frames.
- The hero text may enter once on load, then stay still.
- Card hover: move up 4px and scale to 1.01, with a slightly stronger shadow.
- Only the navbar changes during scroll. After 24px, its background becomes white at 92 percent opacity with `backdrop-filter: blur(22px)` and a soft shadow, over about 420ms.
- `prefers-reduced-motion: reduce` shows everything immediately at full opacity.

## Data rules the appendix already follows

Do not “correct” the appendix.

- 182 route records, 172 distinct numbers, 286 stops.
- 23 routes have `fleet: null` because the paper chart’s count column does not line up row by row.
- Two roads for one number stay as two records.
- There is no first bus, last bus, or frequency in the source. Do not add those fields.
- Coordinates are approximate anchors so a duration can be estimated.
- Yenepoya and Yenepoya University are aliases of stop `deralakatte`. College-only buses are absent.
- Ride math is in `src/lib/geo.ts`: haversine distance, road factor 1.2, 20 km/h, 0.6 minutes at each intermediate stop, minimum 4 minutes.

## Done when

1. `npm run build` succeeds with no environment variables.
2. Bus `1` is State Bank to Athrebail. Bus `1A` is State Bank to Thannirbhavi. Both `1B` roads exist.
3. A search for Yenepoya uses Deralakatte.
4. The letter `v` suggests only V-prefix places.
5. A number with two roads does not navigate by itself.
6. No screen shows a clock time for a bus.
7. Scrolling does not fade the six About cards.
8. Only the Transport card navigates. The other five do not.
9. A reload keeps the waitlist contact and the recent searches. It does not keep the password.

## Appendix

Create each file below at the path in its heading. Paste the body exactly. Do not retype the stop list or the route list from memory.

### `src/data/stops.ts`

```ts
export type Stop = {
  id: string
  name: string
  aliases: string[]
  area: string
  landmark: string
  lat: number
  lng: number
}

/**
 * Stops named on the Mangaluru city bus chart and the route-details list.
 * Coordinates are approximate anchors so a ride can be estimated.
 */
export const stops: Stop[] = [
  {
    id: "addoor",
    name: "Addoor",
    aliases: [],
    area: "Gurupura",
    landmark: "Gurupura",
    lat: 12.9624,
    lng: 74.9086,
  },
  {
    id: "addu",
    name: "Addu",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8142,
    lng: 74.8906,
  },
  {
    id: "adyapady",
    name: "Adyapady",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9724,
    lng: 74.9022,
  },
  {
    id: "adyar",
    name: "Adyar",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8476,
    lng: 74.9068,
  },
  {
    id: "adyar-jetty",
    name: "Adyar Launch Jetty",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8518,
    lng: 74.9184,
  },
  {
    id: "adyar-padav",
    name: "Adyar Padav",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8524,
    lng: 74.9086,
  },
  {
    id: "aj-hospital",
    name: "AJ Hospital",
    aliases: [],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.8988,
    lng: 74.8522,
  },
  {
    id: "akashbhavan",
    name: "Akashbhavan",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9186,
    lng: 74.8642,
  },
  {
    id: "akashvani",
    name: "Akashvani",
    aliases: [],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.8918,
    lng: 74.8512,
  },
  {
    id: "alape",
    name: "Alape",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8436,
    lng: 74.8804,
  },
  {
    id: "ambika-road",
    name: "Ambika Road",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.8224,
    lng: 74.8648,
  },
  {
    id: "amrithnagar",
    name: "Amrithnagar",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.8132,
    lng: 74.8684,
  },
  {
    id: "arkula-padav",
    name: "Arkula Padav",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8412,
    lng: 74.9286,
  },
  {
    id: "ashoknagar",
    name: "Ashoknagar",
    aliases: [],
    area: "Kulur",
    landmark: "Kulur",
    lat: 12.9086,
    lng: 74.8364,
  },
  {
    id: "aspinwall",
    name: "Aspinwall",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8624,
    lng: 74.8722,
  },
  {
    id: "assaigoli",
    name: "Assaigoli",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.8102,
    lng: 74.9164,
  },
  {
    id: "athrebail",
    name: "Athrebail",
    aliases: [],
    area: "Kavoor",
    landmark: "Kavoor",
    lat: 12.9364,
    lng: 74.8728,
  },
  {
    id: "attavara",
    name: "Attavar",
    aliases: [],
    area: "Attavar",
    landmark: "Attavar",
    lat: 12.8608,
    lng: 74.8488,
  },
  {
    id: "b-kaikamba",
    name: "B. Kaikamba",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8848,
    lng: 74.8762,
  },
  {
    id: "babbukatte",
    name: "Babbukatte",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8246,
    lng: 74.8724,
  },
  {
    id: "bagambila",
    name: "Bagambila",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8086,
    lng: 74.8884,
  },
  {
    id: "baikampady",
    name: "Baikampady",
    aliases: [],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9584,
    lng: 74.8126,
  },
  {
    id: "bajal",
    name: "Bajal",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8286,
    lng: 74.8648,
  },
  {
    id: "bajal-church",
    name: "Bajal Church",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8308,
    lng: 74.8684,
  },
  {
    id: "bajal-cross",
    name: "Bajal Cross",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8388,
    lng: 74.8768,
  },
  {
    id: "bajal-jm-road",
    name: "Bajal JM Road",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8312,
    lng: 74.8704,
  },
  {
    id: "bajal-pakkaladka",
    name: "Bajal Pakkaladka",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8334,
    lng: 74.8716,
  },
  {
    id: "bajpe",
    name: "Bajpe",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9648,
    lng: 74.8864,
  },
  {
    id: "bajpe-airport",
    name: "Bajpe Airport",
    aliases: ["Airport", "Mangalore airport", "Mangaluru airport"],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9614,
    lng: 74.8901,
  },
  {
    id: "bala",
    name: "Bala",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9986,
    lng: 74.8224,
  },
  {
    id: "balmatta",
    name: "Balmatta",
    aliases: [],
    area: "Balmatta",
    landmark: "Balmatta",
    lat: 12.8706,
    lng: 74.8496,
  },
  {
    id: "baradka",
    name: "Baradka",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8104,
    lng: 74.8968,
  },
  {
    id: "barua",
    name: "Barua",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8128,
    lng: 74.8922,
  },
  {
    id: "bavalaguri",
    name: "Bavalaguri",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7904,
    lng: 74.9342,
  },
  {
    id: "beach",
    name: "Beach",
    aliases: [],
    area: "Bengre",
    landmark: "Bengre",
    lat: 12.9108,
    lng: 74.8224,
  },
  {
    id: "beeri",
    name: "Beeri",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7886,
    lng: 74.8764,
  },
  {
    id: "bejai",
    name: "Bejai",
    aliases: [],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.8894,
    lng: 74.8456,
  },
  {
    id: "belaringe",
    name: "Belaringe",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7786,
    lng: 74.9042,
  },
  {
    id: "bendoor-cross",
    name: "Bendoor Cross",
    aliases: [],
    area: "Bendoorwell",
    landmark: "Bendoorwell",
    lat: 12.8668,
    lng: 74.8564,
  },
  {
    id: "bengre",
    name: "Bengre",
    aliases: [],
    area: "Bengre",
    landmark: "Bengre",
    lat: 12.8864,
    lng: 74.8172,
  },
  {
    id: "bg-school",
    name: "BG School",
    aliases: [],
    area: "Lalbagh",
    landmark: "Lalbagh",
    lat: 12.8768,
    lng: 74.8442,
  },
  {
    id: "bikarnakatte",
    name: "Bikarnakatte",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8804,
    lng: 74.8698,
  },
  {
    id: "bolla",
    name: "Bolla",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8298,
    lng: 74.8662,
  },
  {
    id: "boloor",
    name: "Boloor",
    aliases: [],
    area: "Boloor",
    landmark: "Boloor",
    lat: 12.8722,
    lng: 74.8296,
  },
  {
    id: "bondel",
    name: "Bondel",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9168,
    lng: 74.8714,
  },
  {
    id: "bsf-gate",
    name: "BSF Gate",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 13.0022,
    lng: 74.8164,
  },
  {
    id: "bunts-hostel",
    name: "Bunts Hostel",
    aliases: [],
    area: "Kadri",
    landmark: "Kadri",
    lat: 12.8746,
    lng: 74.8522,
  },
  {
    id: "capitanio",
    name: "Capitanio",
    aliases: [],
    area: "Pumpwell",
    landmark: "Pumpwell",
    lat: 12.8512,
    lng: 74.8648,
  },
  {
    id: "car-street",
    name: "Car Street",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8708,
    lng: 74.8384,
  },
  {
    id: "cashew-factory",
    name: "Cashew Factory",
    aliases: [],
    area: "Lady Hill",
    landmark: "Lady Hill",
    lat: 12.9032,
    lng: 74.8406,
  },
  {
    id: "chelar-padav",
    name: "Chelar Padav",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9976,
    lng: 74.8824,
  },
  {
    id: "chilimbi",
    name: "Chilimbi",
    aliases: [],
    area: "Lady Hill",
    landmark: "Lady Hill",
    lat: 12.8922,
    lng: 74.8468,
  },
  {
    id: "chitrapura",
    name: "Chitrapura",
    aliases: [],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9668,
    lng: 74.8184,
  },
  {
    id: "chitrapura-temple",
    name: "Chitrapura Temple",
    aliases: [],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9688,
    lng: 74.8162,
  },
  {
    id: "chokkabettu",
    name: "Chokkabettu",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 12.9938,
    lng: 74.8186,
  },
  {
    id: "church",
    name: "Church",
    aliases: [],
    area: "Bengre",
    landmark: "Bengre",
    lat: 12.9072,
    lng: 74.8186,
  },
  {
    id: "church-road",
    name: "Church Road",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9924,
    lng: 74.8348,
  },
  {
    id: "city-hospital",
    name: "City Hospital",
    aliases: [],
    area: "Kadri",
    landmark: "Kadri",
    lat: 12.8724,
    lng: 74.8516,
  },
  {
    id: "clock-tower",
    name: "Clock Tower",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8692,
    lng: 74.8432,
  },
  {
    id: "dambel",
    name: "Dambel",
    aliases: [],
    area: "Kulur",
    landmark: "Kulur",
    lat: 12.9168,
    lng: 74.8286,
  },
  {
    id: "deepak-petrol-pump",
    name: "Deepak Petrol Pump",
    aliases: [],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9622,
    lng: 74.8188,
  },
  {
    id: "delanthabettu",
    name: "Delanthabettu",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9442,
    lng: 74.8906,
  },
  {
    id: "deralakatte",
    name: "Deralakatte",
    aliases: ["Yenepoya", "Yenepoya University"],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8154,
    lng: 74.8788,
  },
  {
    id: "derebail",
    name: "Derebail",
    aliases: [],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.9048,
    lng: 74.8496,
  },
  {
    id: "devinagar",
    name: "Devinagar",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7724,
    lng: 74.8942,
  },
  {
    id: "dharmanagar",
    name: "Dharmanagar",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7762,
    lng: 74.9584,
  },
  {
    id: "elyarpadav",
    name: "Elyarpadav",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8062,
    lng: 74.9042,
  },
  {
    id: "faisal-nagar",
    name: "Faisal Nagar",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8318,
    lng: 74.8914,
  },
  {
    id: "falnir",
    name: "Falnir",
    aliases: [],
    area: "Falnir",
    landmark: "Falnir",
    lat: 12.8646,
    lng: 74.8454,
  },
  {
    id: "gandhinagar",
    name: "Gandhinagar",
    aliases: [],
    area: "Kavoor",
    landmark: "Kavoor",
    lat: 12.9168,
    lng: 74.8554,
  },
  {
    id: "ganeshpura",
    name: "Ganeshpura",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9882,
    lng: 74.8284,
  },
  {
    id: "gramachavadi",
    name: "Gramachavadi",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7984,
    lng: 74.9442,
  },
  {
    id: "gurupura",
    name: "Gurupura",
    aliases: [],
    area: "Gurupura",
    landmark: "Gurupura",
    lat: 12.9426,
    lng: 74.9048,
  },
  {
    id: "harekala",
    name: "Harekala",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7868,
    lng: 74.9386,
  },
  {
    id: "hoige-bazar",
    name: "Hoige Bazar",
    aliases: [],
    area: "Bunder",
    landmark: "Bunder",
    lat: 12.8624,
    lng: 74.8376,
  },
  {
    id: "honnakatte",
    name: "Honnakatte",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 12.9906,
    lng: 74.8064,
  },
  {
    id: "hoovakuvakallu",
    name: "Hoovakuvakallu",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7684,
    lng: 74.9684,
  },
  {
    id: "hosabettu",
    name: "Hosabettu",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 12.9762,
    lng: 74.8024,
  },
  {
    id: "indiranagar",
    name: "Indiranagar",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9762,
    lng: 74.8588,
  },
  {
    id: "innoli",
    name: "Innoli",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7812,
    lng: 74.9624,
  },
  {
    id: "innoli-padav",
    name: "Innoli Padav",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7786,
    lng: 74.9662,
  },
  {
    id: "jalligudde",
    name: "Jalligudde",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8406,
    lng: 74.8824,
  },
  {
    id: "janatha-colony",
    name: "Janatha Colony",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9964,
    lng: 74.8268,
  },
  {
    id: "jappinamogaru",
    name: "Jappinamogaru",
    aliases: [],
    area: "Jeppu",
    landmark: "Jeppu",
    lat: 12.8402,
    lng: 74.8568,
  },
  {
    id: "jeppu-market",
    name: "Jeppu Market",
    aliases: [],
    area: "Jeppu",
    landmark: "Jeppu",
    lat: 12.8542,
    lng: 74.8486,
  },
  {
    id: "jm-road",
    name: "JM Road",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8368,
    lng: 74.8742,
  },
  {
    id: "jodupalli",
    name: "Jodupalli",
    aliases: [],
    area: "Kudroli",
    landmark: "Kudroli",
    lat: 12.8748,
    lng: 74.8328,
  },
  {
    id: "jokatte",
    name: "Jokatte",
    aliases: ["Jokkatte"],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9826,
    lng: 74.8364,
  },
  {
    id: "school",
    name: "Jokatte School",
    aliases: [],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9802,
    lng: 74.8328,
  },
  {
    id: "jyothi",
    name: "Jyothi",
    aliases: [],
    area: "Balmatta",
    landmark: "Balmatta",
    lat: 12.8684,
    lng: 74.8542,
  },
  {
    id: "kadri",
    name: "Kadri",
    aliases: [],
    area: "Kadri",
    landmark: "Kadri",
    lat: 12.8802,
    lng: 74.8562,
  },
  {
    id: "kadri-temple",
    name: "Kadri Temple",
    aliases: [],
    area: "Kadri",
    landmark: "Kadri",
    lat: 12.8826,
    lng: 74.8548,
  },
  {
    id: "gurupura-kaikamba",
    name: "Kaikamba",
    aliases: [],
    area: "Gurupura",
    landmark: "Gurupura",
    lat: 12.9542,
    lng: 74.8964,
  },
  {
    id: "katipalla-kaikamba",
    name: "Kaikamba",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9826,
    lng: 74.8524,
  },
  {
    id: "kaithakumeru",
    name: "Kaithakumeru",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9946,
    lng: 74.8864,
  },
  {
    id: "kaje",
    name: "Kaje",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7684,
    lng: 74.9086,
  },
  {
    id: "kakkebettu",
    name: "Kakkebettu",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8968,
    lng: 74.8862,
  },
  {
    id: "kalakatte",
    name: "Kalakatte",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7986,
    lng: 74.9084,
  },
  {
    id: "kallapu",
    name: "Kallapu",
    aliases: [],
    area: "Thokkottu",
    landmark: "Thokkottu",
    lat: 12.8348,
    lng: 74.8586,
  },
  {
    id: "kalpane",
    name: "Kalpane",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8884,
    lng: 74.8812,
  },
  {
    id: "kambla-padav",
    name: "Kambla Padav",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7864,
    lng: 74.9568,
  },
  {
    id: "kana",
    name: "Kana",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 13.0048,
    lng: 74.8086,
  },
  {
    id: "kandige",
    name: "Kandige",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 13.0064,
    lng: 74.8886,
  },
  {
    id: "kankanady",
    name: "Kankanady",
    aliases: [],
    area: "Kankanady",
    landmark: "Kankanady",
    lat: 12.8622,
    lng: 74.8572,
  },
  {
    id: "kannagudde",
    name: "Kannagudde",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8862,
    lng: 74.8924,
  },
  {
    id: "kannur",
    name: "Kannur",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8442,
    lng: 74.8924,
  },
  {
    id: "kapikad",
    name: "Kapikad",
    aliases: [],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.8936,
    lng: 74.8372,
  },
  {
    id: "thokkottu-kapikad",
    name: "Kapikad",
    aliases: [],
    area: "Thokkottu",
    landmark: "Thokkottu",
    lat: 12.8248,
    lng: 74.8662,
  },
  {
    id: "karambettu",
    name: "Karambettu",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8384,
    lng: 74.8622,
  },
  {
    id: "karmar",
    name: "Karmar",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8422,
    lng: 74.8786,
  },
  {
    id: "kathalsar",
    name: "Kathalsar",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9688,
    lng: 74.8786,
  },
  {
    id: "katipalla",
    name: "Katipalla",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9788,
    lng: 74.8684,
  },
  {
    id: "kavoor",
    name: "Kavoor",
    aliases: [],
    area: "Kavoor",
    landmark: "Kavoor",
    lat: 12.9188,
    lng: 74.8594,
  },
  {
    id: "kc-nagar",
    name: "KC Nagar",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7642,
    lng: 74.8848,
  },
  {
    id: "kc-road",
    name: "KC Road",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7748,
    lng: 74.8806,
  },
  {
    id: "kethikal",
    name: "Kethikal",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.9226,
    lng: 74.9018,
  },
  {
    id: "kinya",
    name: "Kinya",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7588,
    lng: 74.8886,
  },
  {
    id: "kmc",
    name: "KMC",
    aliases: [],
    area: "Attavar",
    landmark: "Attavar",
    lat: 12.8586,
    lng: 74.8496,
  },
  {
    id: "kodakal",
    name: "Kodakal",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8438,
    lng: 74.8968,
  },
  {
    id: "kodikal",
    name: "Kodikal",
    aliases: ["Kodical"],
    area: "Kottara",
    landmark: "Kottara",
    lat: 12.9068,
    lng: 74.8436,
  },
  {
    id: "kodikal-cross",
    name: "Kodikal Cross",
    aliases: [],
    area: "Kottara",
    landmark: "Kottara",
    lat: 12.9042,
    lng: 74.8458,
  },
  {
    id: "kodikal-katte",
    name: "Kodikal Katte",
    aliases: [],
    area: "Kottara",
    landmark: "Kottara",
    lat: 12.9088,
    lng: 74.8412,
  },
  {
    id: "kodikere",
    name: "Kodikere",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 12.9724,
    lng: 74.8088,
  },
  {
    id: "kolambe",
    name: "Kolambe",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9568,
    lng: 74.8862,
  },
  {
    id: "kolthamajal",
    name: "Kolthamajal",
    aliases: [],
    area: "Gurupura",
    landmark: "Gurupura",
    lat: 12.9786,
    lng: 74.9342,
  },
  {
    id: "kolya",
    name: "Kolya",
    aliases: [],
    area: "Thokkottu",
    landmark: "Thokkottu",
    lat: 12.8186,
    lng: 74.8684,
  },
  {
    id: "kombettu",
    name: "Kombettu",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.9184,
    lng: 74.9188,
  },
  {
    id: "konaje",
    name: "Konaje",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.8084,
    lng: 74.9328,
  },
  {
    id: "konchady",
    name: "Konchady",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9084,
    lng: 74.8586,
  },
  {
    id: "konchady-katte",
    name: "Konchady Katte",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9112,
    lng: 74.8614,
  },
  {
    id: "kondana",
    name: "Kondana",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7864,
    lng: 74.8986,
  },
  {
    id: "konimar",
    name: "Konimar",
    aliases: [],
    area: "Neermarga",
    landmark: "Neermarga",
    lat: 12.8702,
    lng: 74.9248,
  },
  {
    id: "kotekar",
    name: "Kotekar",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.8024,
    lng: 74.8726,
  },
  {
    id: "kotepura",
    name: "Kotepura",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.8002,
    lng: 74.8568,
  },
  {
    id: "kottara",
    name: "Kottara",
    aliases: [],
    area: "Kottara",
    landmark: "Kottara",
    lat: 12.9096,
    lng: 74.8352,
  },
  {
    id: "kottara-chowki",
    name: "Kottara Chowki",
    aliases: [],
    area: "Kottara",
    landmark: "Kottara",
    lat: 12.9118,
    lng: 74.8368,
  },
  {
    id: "kottara-cross",
    name: "Kottara Cross",
    aliases: [],
    area: "Kottara",
    landmark: "Kottara",
    lat: 12.9072,
    lng: 74.8384,
  },
  {
    id: "kpt",
    name: "KPT",
    aliases: [],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.8946,
    lng: 74.8564,
  },
  {
    id: "krec",
    name: "KREC",
    aliases: ["NITK", "NITK Surathkal"],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 13.0112,
    lng: 74.7936,
  },
  {
    id: "krishnapura",
    name: "Krishnapura",
    aliases: [],
    area: "Krishnapur",
    landmark: "Krishnapur",
    lat: 12.9846,
    lng: 74.8422,
  },
  {
    id: "ksrtc",
    name: "KSRTC",
    aliases: ["Bejai bus stand", "KSRTC bus stand"],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.8862,
    lng: 74.8424,
  },
  {
    id: "kudimbur",
    name: "Kudimbur",
    aliases: [],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9748,
    lng: 74.8286,
  },
  {
    id: "kudroli",
    name: "Kudroli",
    aliases: [],
    area: "Kudroli",
    landmark: "Kudroli",
    lat: 12.8762,
    lng: 74.8348,
  },
  {
    id: "kudupu",
    name: "Kudupu",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.8964,
    lng: 74.8842,
  },
  {
    id: "kulai",
    name: "Kulai",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 12.9864,
    lng: 74.7986,
  },
  {
    id: "kulshekar",
    name: "Kulshekar",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8876,
    lng: 74.8742,
  },
  {
    id: "kulshekar-chowki",
    name: "Kulshekar Chowki",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8908,
    lng: 74.8786,
  },
  {
    id: "kulur",
    name: "Kulur",
    aliases: [],
    area: "Kulur",
    landmark: "Kulur",
    lat: 12.9204,
    lng: 74.8326,
  },
  {
    id: "kumpala",
    name: "Kumpala",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.8168,
    lng: 74.8662,
  },
  {
    id: "kunjathbail",
    name: "Kunjathbail",
    aliases: [],
    area: "Kavoor",
    landmark: "Kavoor",
    lat: 12.9312,
    lng: 74.8694,
  },
  {
    id: "kuntikana",
    name: "Kuntikana",
    aliases: [],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.9018,
    lng: 74.8448,
  },
  {
    id: "kuthadka",
    name: "Kuthadka",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8322,
    lng: 74.8698,
  },
  {
    id: "kuthar-padav",
    name: "Kuthar Padav",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8202,
    lng: 74.8786,
  },
  {
    id: "kuthethuru",
    name: "Kuthethuru",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9988,
    lng: 74.8926,
  },
  {
    id: "ladyhill",
    name: "Lady Hill",
    aliases: ["Ladyhill"],
    area: "Lady Hill",
    landmark: "Lady Hill",
    lat: 12.8874,
    lng: 74.8452,
  },
  {
    id: "lalbagh",
    name: "Lalbagh",
    aliases: [],
    area: "Lalbagh",
    landmark: "Lalbagh",
    lat: 12.8826,
    lng: 74.8416,
  },
  {
    id: "lamina",
    name: "Lamina",
    aliases: [],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9684,
    lng: 74.8222,
  },
  {
    id: "land-links",
    name: "Land Links Township",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9218,
    lng: 74.8688,
  },
  {
    id: "lewel",
    name: "Lewel",
    aliases: [],
    area: "Jeppu",
    landmark: "Jeppu",
    lat: 12.8564,
    lng: 74.8468,
  },
  {
    id: "madaka",
    name: "Madaka",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8116,
    lng: 74.8948,
  },
  {
    id: "madoor",
    name: "Madoor",
    aliases: [],
    area: "Thokkottu",
    landmark: "Thokkottu",
    lat: 12.8124,
    lng: 74.8742,
  },
  {
    id: "madya",
    name: "Madya",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9862,
    lng: 74.8586,
  },
  {
    id: "madya-padav",
    name: "Madya Padav",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9896,
    lng: 74.8642,
  },
  {
    id: "madyar",
    name: "Madyar",
    aliases: [],
    area: "Thokkottu",
    landmark: "Thokkottu",
    lat: 12.8068,
    lng: 74.8822,
  },
  {
    id: "malemar",
    name: "Malemar",
    aliases: [],
    area: "Kottara",
    landmark: "Kottara",
    lat: 12.9088,
    lng: 74.8406,
  },
  {
    id: "mallikatte",
    name: "Mallikatte",
    aliases: [],
    area: "Kadri",
    landmark: "Kadri",
    lat: 12.8764,
    lng: 74.8586,
  },
  {
    id: "mangaji",
    name: "Mangaji",
    aliases: [],
    area: "Gurupura",
    landmark: "Gurupura",
    lat: 12.9844,
    lng: 74.9416,
  },
  {
    id: "mangaladevi",
    name: "Mangaladevi",
    aliases: [],
    area: "Mangaladevi",
    landmark: "Mangaladevi",
    lat: 12.8492,
    lng: 74.8438,
  },
  {
    id: "mangaladevi-cross",
    name: "Mangaladevi Cross",
    aliases: [],
    area: "Mangaladevi",
    landmark: "Mangaladevi",
    lat: 12.8506,
    lng: 74.8462,
  },
  {
    id: "mangalagangothri",
    name: "Mangalagangothri",
    aliases: ["Mangalore University", "University"],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.8156,
    lng: 74.9246,
  },
  {
    id: "mangalanthi",
    name: "Mangalanthi",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7846,
    lng: 74.9184,
  },
  {
    id: "mangalpete",
    name: "Mangalpete",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9868,
    lng: 74.8764,
  },
  {
    id: "manjanady",
    name: "Manjanady",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7924,
    lng: 74.9126,
  },
  {
    id: "mannagudda",
    name: "Mannagudda",
    aliases: [],
    area: "Mannagudda",
    landmark: "Mannagudda",
    lat: 12.8812,
    lng: 74.8428,
  },
  {
    id: "marakada",
    name: "Marakada",
    aliases: [],
    area: "Kavoor",
    landmark: "Kavoor",
    lat: 12.9246,
    lng: 74.8632,
  },
  {
    id: "maravoor",
    name: "Maravoor",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9468,
    lng: 74.8722,
  },
  {
    id: "marigudi",
    name: "Marigudi",
    aliases: [],
    area: "Kulur",
    landmark: "Kulur",
    lat: 12.9054,
    lng: 74.8388,
  },
  {
    id: "marnamikatta",
    name: "Marnamikatta",
    aliases: [],
    area: "Mangaladevi",
    landmark: "Mangaladevi",
    lat: 12.8536,
    lng: 74.8472,
  },
  {
    id: "maroli",
    name: "Maroli",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8586,
    lng: 74.8764,
  },
  {
    id: "maryhill",
    name: "Maryhill",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9062,
    lng: 74.8684,
  },
  {
    id: "merlapadav",
    name: "Merlapadav",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8468,
    lng: 74.9224,
  },
  {
    id: "montepadav",
    name: "Montepadav",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7768,
    lng: 74.9246,
  },
  {
    id: "moodperar",
    name: "Moodperar",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9488,
    lng: 74.8922,
  },
  {
    id: "moodushedde",
    name: "Moodushedde",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.9186,
    lng: 74.9084,
  },
  {
    id: "morgans-gate",
    name: "Morgan's Gate",
    aliases: ["Morgan Gate", "Morgans Gate"],
    area: "Jeppu",
    landmark: "Jeppu",
    lat: 12.8528,
    lng: 74.8524,
  },
  {
    id: "mrpl",
    name: "MRPL",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9924,
    lng: 74.8486,
  },
  {
    id: "mrpl-colony",
    name: "MRPL Colony",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9902,
    lng: 74.8548,
  },
  {
    id: "mrpl-gate",
    name: "MRPL Gate",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9948,
    lng: 74.8362,
  },
  {
    id: "mudipu",
    name: "Mudipu",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7742,
    lng: 74.9726,
  },
  {
    id: "mugaru",
    name: "Mugaru",
    aliases: [],
    area: "Baikampady",
    landmark: "Baikampady",
    lat: 12.9648,
    lng: 74.8246,
  },
  {
    id: "mukka",
    name: "Mukka",
    aliases: [],
    area: "Mukka",
    landmark: "Mukka",
    lat: 13.0256,
    lng: 74.7894,
  },
  {
    id: "mulihitlu",
    name: "Mulihitlu",
    aliases: [],
    area: "Mangaladevi",
    landmark: "Mangaladevi",
    lat: 12.8468,
    lng: 74.8412,
  },
  {
    id: "mullakad",
    name: "Mullakad",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9142,
    lng: 74.8608,
  },
  {
    id: "munchur",
    name: "Munchur",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 13.0168,
    lng: 74.8082,
  },
  {
    id: "muthappa-gudi",
    name: "Muthappa Gudi",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8986,
    lng: 74.8894,
  },
  {
    id: "nadupadav",
    name: "Nadupadav",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.8042,
    lng: 74.9406,
  },
  {
    id: "nagori",
    name: "Nagori",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8496,
    lng: 74.8694,
  },
  {
    id: "nandanpura",
    name: "Nandanpura",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9194,
    lng: 74.8622,
  },
  {
    id: "nandigudda",
    name: "Nandigudda",
    aliases: [],
    area: "Nandigudda",
    landmark: "Nandigudda",
    lat: 12.8552,
    lng: 74.8506,
  },
  {
    id: "nanthoor",
    name: "Nanthoor",
    aliases: [],
    area: "Kankanady",
    landmark: "Kankanady",
    lat: 12.8738,
    lng: 74.8636,
  },
  {
    id: "narayana-guru-iti",
    name: "Narayana Guru ITI",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9816,
    lng: 74.8722,
  },
  {
    id: "naringana",
    name: "Naringana Panchayath",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7724,
    lng: 74.9302,
  },
  {
    id: "narya",
    name: "Narya",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7648,
    lng: 74.9642,
  },
  {
    id: "natekal",
    name: "Natekal",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.8048,
    lng: 74.9026,
  },
  {
    id: "navabharath-circle",
    name: "Navabharath Circle",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8728,
    lng: 74.8448,
  },
  {
    id: "neermarga",
    name: "Neermarga",
    aliases: [],
    area: "Neermarga",
    landmark: "Neermarga",
    lat: 12.8764,
    lng: 74.9128,
  },
  {
    id: "nehru-circle",
    name: "Nehru Circle",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8648,
    lng: 74.8412,
  },
  {
    id: "new-chitra",
    name: "New Chitra",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8732,
    lng: 74.8368,
  },
  {
    id: "new-padupu",
    name: "New Padupu",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8044,
    lng: 74.9086,
  },
  {
    id: "ombathukere",
    name: "Ombathukere",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.7964,
    lng: 74.8586,
  },
  {
    id: "ontemar",
    name: "Ontemar",
    aliases: [],
    area: "Neermarga",
    landmark: "Neermarga",
    lat: 12.8688,
    lng: 74.9186,
  },
  {
    id: "pachanady",
    name: "Pachanady",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9224,
    lng: 74.8768,
  },
  {
    id: "padavinangady",
    name: "Padavinangady",
    aliases: [],
    area: "Bondel",
    landmark: "Bondel",
    lat: 12.9126,
    lng: 74.8662,
  },
  {
    id: "paddiangady",
    name: "Paddiangady",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9824,
    lng: 74.8618,
  },
  {
    id: "padil",
    name: "Padil",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8468,
    lng: 74.8746,
  },
  {
    id: "bridge",
    name: "Padil Bridge",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8452,
    lng: 74.8862,
  },
  {
    id: "padulikatta",
    name: "Padulikatta",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.8008,
    lng: 74.8964,
  },
  {
    id: "paduperara",
    name: "Paduperara",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9526,
    lng: 74.8884,
  },
  {
    id: "pajeer",
    name: "Pajeer",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.8026,
    lng: 74.9384,
  },
  {
    id: "paldane",
    name: "Paldane",
    aliases: [],
    area: "Neermarga",
    landmark: "Neermarga",
    lat: 12.8826,
    lng: 74.9024,
  },
  {
    id: "pallakere",
    name: "Pallakere",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8384,
    lng: 74.8702,
  },
  {
    id: "pallipady",
    name: "Pallipady",
    aliases: [],
    area: "Gurupura",
    landmark: "Gurupura",
    lat: 12.9742,
    lng: 74.9268,
  },
  {
    id: "panambur",
    name: "Panambur",
    aliases: [],
    area: "Panambur",
    landmark: "Panambur",
    lat: 12.9386,
    lng: 74.8228,
  },
  {
    id: "pandeshwar",
    name: "Pandeshwar",
    aliases: [],
    area: "Bunder",
    landmark: "Bunder",
    lat: 12.8658,
    lng: 74.8402,
  },
  {
    id: "panjimogaru",
    name: "Panjimogaru",
    aliases: [],
    area: "Kavoor",
    landmark: "Kavoor",
    lat: 12.9146,
    lng: 74.8512,
  },
  {
    id: "parari",
    name: "Parari",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.9298,
    lng: 74.9164,
  },
  {
    id: "pavoor",
    name: "Pavoor",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7926,
    lng: 74.9486,
  },
  {
    id: "pavoor-panchayath",
    name: "Pavoor Panchayath",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7902,
    lng: 74.9524,
  },
  {
    id: "perla",
    name: "Perla",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8362,
    lng: 74.8826,
  },
  {
    id: "pilikula",
    name: "Pilikula",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.9294,
    lng: 74.8968,
  },
  {
    id: "pinto-gate",
    name: "Pinto Gate",
    aliases: [],
    area: "Jeppu",
    landmark: "Jeppu",
    lat: 12.8518,
    lng: 74.8494,
  },
  {
    id: "polali",
    name: "Polali",
    aliases: [],
    area: "Gurupura",
    landmark: "Gurupura",
    lat: 12.9688,
    lng: 74.9184,
  },
  {
    id: "porkodi",
    name: "Porkodi",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9586,
    lng: 74.8684,
  },
  {
    id: "porkodi-temple",
    name: "Porkodi Temple",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9612,
    lng: 74.8648,
  },
  {
    id: "preethinagar",
    name: "Preethinagar",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.9012,
    lng: 74.8928,
  },
  {
    id: "pumpwell",
    name: "Pumpwell",
    aliases: [],
    area: "Pumpwell",
    landmark: "Pumpwell",
    lat: 12.8548,
    lng: 74.8604,
  },
  {
    id: "pvs",
    name: "PVS",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8742,
    lng: 74.8458,
  },
  {
    id: "railway-station",
    name: "Railway Station",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8668,
    lng: 74.8842,
  },
  {
    id: "ranipura",
    name: "Ranipura",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8168,
    lng: 74.8864,
  },
  {
    id: "rto",
    name: "RTO",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8662,
    lng: 74.8368,
  },
  {
    id: "sahyadri",
    name: "Sahyadri",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8564,
    lng: 74.9248,
  },
  {
    id: "sankolige",
    name: "Sankolige",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7804,
    lng: 74.8788,
  },
  {
    id: "saripalla",
    name: "Saripalla",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8824,
    lng: 74.8968,
  },
  {
    id: "shaktinagar",
    name: "Shaktinagar",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8946,
    lng: 74.8884,
  },
  {
    id: "shaktinagar-cross",
    name: "Shaktinagar Cross",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8912,
    lng: 74.8846,
  },
  {
    id: "shalepadav",
    name: "Shalepadav",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.9248,
    lng: 74.9142,
  },
  {
    id: "shashihitlu",
    name: "Shashihitlu",
    aliases: [],
    area: "Mukka",
    landmark: "Mukka",
    lat: 13.0584,
    lng: 74.7786,
  },
  {
    id: "shediguri",
    name: "Shediguri",
    aliases: [],
    area: "Kulur",
    landmark: "Kulur",
    lat: 12.9124,
    lng: 74.8334,
  },
  {
    id: "shibaroor",
    name: "Shibaroor",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9486,
    lng: 74.8942,
  },
  {
    id: "silvergate",
    name: "Silvergate",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8846,
    lng: 74.8942,
  },
  {
    id: "someshwara",
    name: "Someshwara",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.7848,
    lng: 74.8564,
  },
  {
    id: "soorinje",
    name: "Soorinje",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9624,
    lng: 74.8826,
  },
  {
    id: "st-agnes",
    name: "St Agnes",
    aliases: [],
    area: "Kankanady",
    landmark: "Kankanady",
    lat: 12.8696,
    lng: 74.8608,
  },
  {
    id: "state-bank",
    name: "State Bank",
    aliases: ["Hampankatta", "State Bank bus stand", "State Bank stand"],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8696,
    lng: 74.8428,
  },
  {
    id: "sulthan-bathery",
    name: "Sulthan Bathery",
    aliases: ["Sultan Battery"],
    area: "Boloor",
    landmark: "Boloor",
    lat: 12.8698,
    lng: 74.8264,
  },
  {
    id: "sunkadakatte",
    name: "Sunkadakatte",
    aliases: [],
    area: "Bajpe",
    landmark: "Bajpe",
    lat: 12.9602,
    lng: 74.8888,
  },
  {
    id: "surathkal",
    name: "Surathkal",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 13.0016,
    lng: 74.7942,
  },
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8668,
    lng: 74.8448,
  },
  {
    id: "talapady",
    name: "Talapady",
    aliases: [],
    area: "Talapady",
    landmark: "Talapady",
    lat: 12.7686,
    lng: 74.8824,
  },
  {
    id: "thandolige",
    name: "Thandolige",
    aliases: [],
    area: "Bajal",
    landmark: "Bajal",
    lat: 12.8346,
    lng: 74.8664,
  },
  {
    id: "thannirbhavi",
    name: "Thannirbhavi",
    aliases: [],
    area: "Bengre",
    landmark: "Bengre",
    lat: 12.9036,
    lng: 74.8148,
  },
  {
    id: "tharethota",
    name: "Tharethota",
    aliases: [],
    area: "Kankanady",
    landmark: "Kankanady",
    lat: 12.8664,
    lng: 74.8628,
  },
  {
    id: "tharigudda",
    name: "Tharigudda",
    aliases: [],
    area: "Neermarga",
    landmark: "Neermarga",
    lat: 12.8746,
    lng: 74.9202,
  },
  {
    id: "tharigudde",
    name: "Tharigudde",
    aliases: [],
    area: "Deralakatte",
    landmark: "Deralakatte",
    lat: 12.8088,
    lng: 74.8986,
  },
  {
    id: "thokkottu",
    name: "Thokkottu",
    aliases: [],
    area: "Thokkottu",
    landmark: "Thokkottu",
    lat: 12.8294,
    lng: 74.8628,
  },
  {
    id: "over-bridge",
    name: "Thokkottu Over Bridge",
    aliases: [],
    area: "Thokkottu",
    landmark: "Thokkottu",
    lat: 12.8268,
    lng: 74.8604,
  },
  {
    id: "thokur",
    name: "Thokur",
    aliases: [],
    area: "Surathkal",
    landmark: "Surathkal",
    lat: 12.9948,
    lng: 74.8022,
  },
  {
    id: "thoudugoli",
    name: "Thoudugoli",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7682,
    lng: 74.9364,
  },
  {
    id: "thoudugoli-cross",
    name: "Thoudugoli Cross",
    aliases: [],
    area: "Konaje",
    landmark: "Konaje",
    lat: 12.7706,
    lng: 74.9328,
  },
  {
    id: "tibar",
    name: "Tibar",
    aliases: [],
    area: "Katipalla",
    landmark: "Katipalla",
    lat: 12.9548,
    lng: 74.8884,
  },
  {
    id: "ulaibettu",
    name: "Ulaibettu",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.9342,
    lng: 74.9226,
  },
  {
    id: "ullal",
    name: "Ullal",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.8056,
    lng: 74.8608,
  },
  {
    id: "ullal-jetty",
    name: "Ullal Launch Jetty",
    aliases: [],
    area: "Ullal",
    landmark: "Ullal",
    lat: 12.7984,
    lng: 74.8526,
  },
  {
    id: "umikhan",
    name: "Umikhan",
    aliases: [],
    area: "Kulshekar",
    landmark: "Kulshekar",
    lat: 12.8838,
    lng: 74.8906,
  },
  {
    id: "urwa-market",
    name: "Urwa Market",
    aliases: [],
    area: "Lady Hill",
    landmark: "Lady Hill",
    lat: 12.9016,
    lng: 74.8418,
  },
  {
    id: "urwa-store",
    name: "Urwa Store",
    aliases: ["Urva Stores", "Urwastore"],
    area: "Lady Hill",
    landmark: "Lady Hill",
    lat: 12.8992,
    lng: 74.8476,
  },
  {
    id: "v-gorigudda",
    name: "V. Gorigudda",
    aliases: [],
    area: "Kankanady",
    landmark: "Kankanady",
    lat: 12.8508,
    lng: 74.8512,
  },
  {
    id: "valachil",
    name: "Valachil",
    aliases: [],
    area: "Adyar",
    landmark: "Adyar",
    lat: 12.8628,
    lng: 74.9326,
  },
  {
    id: "valencia",
    name: "Valencia",
    aliases: [],
    area: "Kankanady",
    landmark: "Kankanady",
    lat: 12.8572,
    lng: 74.8534,
  },
  {
    id: "vamanjoor",
    name: "Vamanjoor",
    aliases: [],
    area: "Vamanjoor",
    landmark: "Vamanjoor",
    lat: 12.9072,
    lng: 74.8906,
  },
  {
    id: "veeranagar",
    name: "Veeranagar",
    aliases: [],
    area: "Padil",
    landmark: "Padil",
    lat: 12.8344,
    lng: 74.8868,
  },
  {
    id: "vishranthi-church",
    name: "Vishranthi Church",
    aliases: [],
    area: "Lady Hill",
    landmark: "Lady Hill",
    lat: 12.9048,
    lng: 74.8442,
  },
  {
    id: "vishwabhavan",
    name: "Vishwabhavan",
    aliases: [],
    area: "Hampankatta",
    landmark: "Hampankatta",
    lat: 12.8718,
    lng: 74.8442,
  },
  {
    id: "yekkur",
    name: "Yekkur",
    aliases: [],
    area: "Pumpwell",
    landmark: "Pumpwell",
    lat: 12.8462,
    lng: 74.8588,
  },
  {
    id: "yemmekere",
    name: "Yemmekere",
    aliases: [],
    area: "Jeppu",
    landmark: "Jeppu",
    lat: 12.8588,
    lng: 74.8442,
  },
  {
    id: "yeyyadi",
    name: "Yeyyadi",
    aliases: [],
    area: "Bejai",
    landmark: "Bejai",
    lat: 12.8982,
    lng: 74.8628,
  },
]

export const stopById = new Map(stops.map((stop) => [stop.id, stop]))
```

### `src/data/buses.ts`

```ts
export type Bus = {
  id: string
  number: string
  stops: string[]
  /** Buses listed for this route on the city chart. */
  fleet: number | null
}

/**
 * Every city service from the Mangaluru all-route chart and the
 * stop-by-stop details list. The chart has no first or last clock.
 */
export const buses: Bus[] = [
  {
    id: "1",
    number: "1",
    stops: ["state-bank", "car-street", "new-chitra", "kudroli", "mannagudda", "ladyhill", "chilimbi", "urwa-store", "kodikal-cross", "kulur", "panjimogaru", "kavoor", "marakada", "kunjathbail", "athrebail"],
    fleet: 1,
  },
  {
    id: "1a",
    number: "1A",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ladyhill", "chilimbi", "urwa-store", "kodikal-cross", "kulur", "beach", "church", "thannirbhavi"],
    fleet: 1,
  },
  {
    id: "1b",
    number: "1B",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ladyhill", "chilimbi", "urwa-store", "kodikal-cross", "kodikal-katte", "kodikal"],
    fleet: 1,
  },
  {
    id: "1b-2",
    number: "1B",
    stops: ["state-bank", "car-street", "new-chitra", "kudroli", "mannagudda", "ladyhill", "chilimbi", "urwa-store", "kodikal-cross", "kodikal-katte", "kodikal"],
    fleet: 3,
  },
  {
    id: "1c",
    number: "1C",
    stops: ["kodikal", "kodikal-cross", "urwa-store", "ladyhill", "lalbagh", "pvs", "jyothi", "kankanady", "valencia", "nandigudda", "morgans-gate", "mangaladevi"],
    fleet: 1,
  },
  {
    id: "2",
    number: "2",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "krec", "mukka"],
    fleet: 2,
  },
  {
    id: "2a",
    number: "2A",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kodikal-cross", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krec", "mukka", "shashihitlu"],
    fleet: 3,
  },
  {
    id: "2b",
    number: "2B",
    stops: ["bengre", "thannirbhavi", "mrpl-gate", "kulur", "panambur", "baikampady", "lamina", "kudimbur", "school", "jokatte", "porkodi-temple", "bajpe"],
    fleet: 1,
  },
  {
    id: "2c",
    number: "2C",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kodikal-cross", "kulur", "panambur", "baikampady", "lamina", "kudimbur", "school", "jokatte"],
    fleet: 6,
  },
  {
    id: "2e-1",
    number: "2E",
    stops: ["jokatte", "school", "kudimbur", "lamina", "baikampady", "panambur", "kulur", "urwa-store", "ladyhill", "lalbagh", "pvs", "jyothi", "kankanady", "valencia", "morgans-gate", "mangaladevi"],
    fleet: 2,
  },
  {
    id: "2e",
    number: "2E",
    stops: ["bajpe", "jokatte", "school", "kudimbur", "lamina", "baikampady", "panambur", "kulur", "urwa-store", "ladyhill", "lalbagh", "pvs", "jyothi", "kankanady"],
    fleet: 2,
  },
  {
    id: "2e-2",
    number: "2E",
    stops: ["jokatte", "school", "kudimbur", "lamina", "baikampady", "panambur", "kulur", "urwa-store", "ladyhill", "lalbagh", "ksrtc", "bejai", "kpt", "nanthoor", "mallikatte", "kankanady", "morgans-gate", "mangaladevi"],
    fleet: null,
  },
  {
    id: "2f",
    number: "2F",
    stops: ["bondel", "kavoor", "kulur", "baikampady", "surathkal", "krec", "shashihitlu"],
    fleet: 1,
  },
  {
    id: "2g",
    number: "2G",
    stops: ["bajpe", "jokatte", "baikampady", "kodikere", "surathkal"],
    fleet: 2,
  },
  {
    id: "3a",
    number: "3A",
    stops: ["state-bank", "jyothi", "balmatta", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "moodushedde"],
    fleet: 3,
  },
  {
    id: "3b",
    number: "3B",
    stops: ["state-bank", "falnir", "balmatta", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "moodushedde"],
    fleet: 4,
  },
  {
    id: "3c",
    number: "3C",
    stops: ["mangaladevi", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "moodushedde"],
    fleet: 3,
  },
  {
    id: "3d",
    number: "3D",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "moodushedde", "shalepadav"],
    fleet: 2,
  },
  {
    id: "3e",
    number: "3E",
    stops: ["katipalla", "katipalla-kaikamba", "surathkal", "kulur", "kavoor", "pachanady", "vamanjoor", "moodushedde"],
    fleet: 5,
  },
  {
    id: "3f",
    number: "3F",
    stops: ["kottara", "kottara-cross", "ksrtc", "bejai", "kpt", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "tharigudda", "kombettu"],
    fleet: 1,
  },
  {
    id: "3g",
    number: "3G",
    stops: ["kottara", "kottara-cross", "aj-hospital", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "kethikal", "parari", "ulaibettu"],
    fleet: 1,
  },
  {
    id: "3h",
    number: "3H",
    stops: ["chelar-padav", "madya", "krec", "surathkal", "baikampady", "kulur", "panjimogaru", "kavoor", "pachanady", "vamanjoor", "pilikula", "moodushedde"],
    fleet: 1,
  },
  {
    id: "3k",
    number: "3K",
    stops: ["talapady", "beeri", "kolya", "thokkottu", "jappinamogaru", "pumpwell", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "moodushedde"],
    fleet: 3,
  },
  {
    id: "3l",
    number: "3L",
    stops: ["urwa-store", "kottara", "kuntikana", "kpt", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "moodushedde"],
    fleet: 1,
  },
  {
    id: "4",
    number: "4",
    stops: ["state-bank", "falnir", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar", "kulshekar-chowki", "kannagudde"],
    fleet: 1,
  },
  {
    id: "4a",
    number: "4A",
    stops: ["state-bank", "falnir", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar", "kulshekar-chowki", "paldane", "neermarga", "ontemar", "adyar-padav", "merlapadav"],
    fleet: 1,
  },
  {
    id: "4b",
    number: "4B",
    stops: ["state-bank", "falnir", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar-chowki", "silvergate", "saripalla"],
    fleet: 1,
  },
  {
    id: "4c",
    number: "4C",
    stops: ["state-bank", "falnir", "balmatta", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar-chowki", "paldane", "neermarga"],
    fleet: 2,
  },
  {
    id: "4d",
    number: "4D",
    stops: ["mangaladevi", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar-chowki", "umikhan", "saripalla", "kannagudde"],
    fleet: 2,
  },
  {
    id: "4e",
    number: "4E",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "bikarnakatte", "kulshekar-chowki", "paldane", "neermarga", "ontemar", "adyar-padav", "merlapadav"],
    fleet: 1,
  },
  {
    id: "5",
    number: "5",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "valencia", "nandigudda", "morgans-gate"],
    fleet: 8,
  },
  {
    id: "6a",
    number: "6A",
    stops: ["state-bank", "jyothi", "balmatta", "st-agnes", "nanthoor", "b-kaikamba", "kalpane", "shaktinagar-cross", "kakkebettu", "shaktinagar"],
    fleet: 2,
  },
  {
    id: "6b",
    number: "6B",
    stops: ["state-bank", "falnir", "kankanady", "st-agnes", "nanthoor", "b-kaikamba", "kalpane", "shaktinagar-cross", "kakkebettu", "muthappa-gudi", "shaktinagar"],
    fleet: 2,
  },
  {
    id: "6c",
    number: "6C",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "b-kaikamba", "kalpane", "shaktinagar-cross", "kakkebettu", "shaktinagar"],
    fleet: 2,
  },
  {
    id: "6d",
    number: "6D",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "b-kaikamba", "kalpane", "shaktinagar-cross", "kakkebettu", "shaktinagar", "preethinagar"],
    fleet: 2,
  },
  {
    id: "7",
    number: "7",
    stops: ["state-bank", "car-street", "new-chitra", "kudroli", "mannagudda", "ladyhill", "chilimbi", "urwa-store"],
    fleet: 1,
  },
  {
    id: "9",
    number: "9",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "capitanio", "nagori", "padil", "karmar", "jm-road", "bajal-pakkaladka", "bajal-church"],
    fleet: 3,
  },
  {
    id: "9a",
    number: "9A",
    stops: ["clock-tower", "pandeshwar", "yemmekere", "lewel", "jeppu-market", "morgans-gate", "jappinamogaru", "karambettu", "thandolige", "kuthadka", "bolla", "bajal-church", "bajal-jm-road"],
    fleet: null,
  },
  {
    id: "9b",
    number: "9B",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thandolige", "bolla", "bajal-church", "bajal-pakkaladka", "jm-road"],
    fleet: 1,
  },
  {
    id: "9c",
    number: "9C",
    stops: ["kunjathbail", "kavoor", "panjimogaru", "kulur", "urwa-store", "ladyhill", "lalbagh", "pvs", "bunts-hostel", "jyothi", "kankanady", "pumpwell", "yekkur", "bajal"],
    fleet: 1,
  },
  {
    id: "10a",
    number: "10A",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "capitanio", "nagori", "padil", "kannur", "adyar", "adyar-jetty", "sahyadri"],
    fleet: 2,
  },
  {
    id: "10b",
    number: "10B",
    stops: ["kankanady", "pumpwell", "capitanio", "nagori", "padil", "kannur", "adyar", "adyar-jetty", "sahyadri", "valachil"],
    fleet: 1,
  },
  {
    id: "11a",
    number: "11A",
    stops: ["state-bank", "falnir", "kankanady", "pumpwell", "capitanio", "nagori", "padil", "kannur", "adyar", "adyar-jetty", "sahyadri"],
    fleet: 2,
  },
  {
    id: "11b",
    number: "11B",
    stops: ["state-bank", "falnir", "kankanady", "pumpwell", "capitanio", "nagori", "padil", "jalligudde"],
    fleet: 3,
  },
  {
    id: "11c",
    number: "11C",
    stops: ["mangaladevi", "kankanady", "pumpwell", "capitanio", "nagori", "padil", "jalligudde"],
    fleet: 3,
  },
  {
    id: "11d",
    number: "11D",
    stops: ["pallakere", "padil", "pumpwell", "kankanady", "st-agnes", "mallikatte", "kadri-temple", "bejai", "ksrtc", "kapikad", "urwa-store", "kottara"],
    fleet: 1,
  },
  {
    id: "12a",
    number: "12A",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "gurupura", "gurupura-kaikamba", "addoor", "polali", "pallipady"],
    fleet: 1,
  },
  {
    id: "12b",
    number: "12B",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "bikarnakatte", "kulshekar", "kudupu", "vamanjoor", "gurupura", "gurupura-kaikamba", "addoor", "polali", "kolthamajal", "mangaji"],
    fleet: 1,
  },
  {
    id: "13",
    number: "13",
    stops: ["state-bank", "car-street", "new-chitra", "kudroli", "mannagudda", "ladyhill", "chilimbi", "urwa-store"],
    fleet: 1,
  },
  {
    id: "13a",
    number: "13A",
    stops: ["state-bank", "car-street", "new-chitra", "kudroli", "mannagudda", "ladyhill", "chilimbi", "urwa-store", "kottara"],
    fleet: 1,
  },
  {
    id: "13a-1",
    number: "13A",
    stops: ["kunjathbail", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "surathkal", "krishnapura", "katipalla", "madya", "chelar-padav"],
    fleet: 3,
  },
  {
    id: "13b",
    number: "13B",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ladyhill", "chilimbi", "urwa-store", "kodikal-cross", "kulur", "panjimogaru", "gandhinagar", "kavoor", "kunjathbail"],
    fleet: 5,
  },
  {
    id: "13c",
    number: "13C",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ladyhill", "chilimbi", "urwa-store", "kodikal-cross", "kulur", "panjimogaru", "gandhinagar", "kavoor", "bondel"],
    fleet: 3,
  },
  {
    id: "13d",
    number: "13D",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ladyhill", "chilimbi", "urwa-store", "kodikal-cross", "kulur", "panjimogaru", "gandhinagar", "kavoor", "bondel", "pachanady"],
    fleet: 1,
  },
  {
    id: "13e",
    number: "13E",
    stops: ["kunjathbail", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "surathkal"],
    fleet: 1,
  },
  {
    id: "13f",
    number: "13F",
    stops: ["kunjathbail", "kavoor", "panjimogaru", "kulur", "urwa-store", "ladyhill", "lalbagh", "pvs", "jyothi", "kankanady", "valencia", "morgans-gate", "mangaladevi"],
    fleet: 3,
  },
  {
    id: "13g-1",
    number: "13G",
    stops: ["kunjathbail", "kavoor", "panjimogaru", "kulur", "urwa-store", "ladyhill", "lalbagh", "ksrtc", "bejai", "kpt", "nanthoor", "mallikatte", "kankanady", "morgans-gate", "mangaladevi"],
    fleet: 1,
  },
  {
    id: "13g",
    number: "13G",
    stops: ["athrebail", "kunjathbail", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "surathkal", "krec", "munchur", "madya-padav", "chelar-padav", "mrpl"],
    fleet: 2,
  },
  {
    id: "13g-2",
    number: "13G",
    stops: ["kunjathbail", "kavoor", "panjimogaru", "kulur", "panambur", "deepak-petrol-pump", "mugaru", "lamina", "baikampady", "chitrapura", "honnakatte", "kodikere", "thokur", "kana", "surathkal"],
    fleet: 1,
  },
  {
    id: "13h",
    number: "13H",
    stops: ["bondel", "kavoor", "panjimogaru", "kulur", "urwa-store", "ladyhill", "lalbagh", "ksrtc", "bejai", "kpt", "nanthoor", "mallikatte", "kankanady", "morgans-gate", "mangaladevi"],
    fleet: 4,
  },
  {
    id: "13h-1",
    number: "13H",
    stops: ["mangaladevi", "kankanady", "pumpwell", "nanthoor", "aj-hospital", "kuntikana", "kottara-cross", "urwa-store", "kulur", "panjimogaru", "kavoor", "bondel"],
    fleet: 1,
  },
  {
    id: "13j",
    number: "13J",
    stops: ["athrebail", "kunjathbail", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "surathkal", "kana", "church-road", "katipalla", "soorinje"],
    fleet: null,
  },
  {
    id: "13l",
    number: "13L",
    stops: ["kunjathbail", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krishnapura", "katipalla", "katipalla-kaikamba"],
    fleet: 1,
  },
  {
    id: "14",
    number: "14",
    stops: ["state-bank", "falnir", "kankanady", "st-agnes", "nanthoor", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel"],
    fleet: 2,
  },
  {
    id: "14a",
    number: "14A",
    stops: ["state-bank", "jyothi", "bendoor-cross", "st-agnes", "nanthoor", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel"],
    fleet: 1,
  },
  {
    id: "14b",
    number: "14B",
    stops: ["kankanady", "st-agnes", "nanthoor", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel", "pachanady"],
    fleet: 1,
  },
  {
    id: "14c",
    number: "14C",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel"],
    fleet: 1,
  },
  {
    id: "14d",
    number: "14D",
    stops: ["jeppu-market", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel"],
    fleet: 1,
  },
  {
    id: "14e",
    number: "14E",
    stops: ["pumpwell", "nanthoor", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel", "pachanady", "vamanjoor"],
    fleet: 1,
  },
  {
    id: "14f",
    number: "14F",
    stops: ["kankanady", "pumpwell", "tharethota", "nanthoor", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel", "kavoor", "kunjathbail"],
    fleet: 1,
  },
  {
    id: "15",
    number: "15",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal"],
    fleet: 5,
  },
  {
    id: "15a",
    number: "15A",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krishnapura", "katipalla"],
    fleet: 11,
  },
  {
    id: "15a-1",
    number: "15A",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krishnapura", "katipalla", "narayana-guru-iti", "madya"],
    fleet: null,
  },
  {
    id: "15b",
    number: "15B",
    stops: ["kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krishnapura", "katipalla", "chelar-padav", "mrpl-colony"],
    fleet: null,
  },
  {
    id: "15c",
    number: "15C",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krishnapura", "katipalla", "soorinje"],
    fleet: 3,
  },
  {
    id: "15d",
    number: "15D",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krishnapura", "katipalla-kaikamba", "mangalpete", "mrpl", "kuthethuru"],
    fleet: 1,
  },
  {
    id: "15e",
    number: "15E",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "kana", "bala", "church-road", "ganeshpura"],
    fleet: 1,
  },
  {
    id: "15f",
    number: "15F",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krishnapura", "katipalla", "mrpl", "kaithakumeru"],
    fleet: 2,
  },
  {
    id: "15g",
    number: "15G",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "kana", "bsf-gate", "janatha-colony"],
    fleet: 1,
  },
  {
    id: "15h",
    number: "15H",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "kana", "bala", "church-road", "katipalla", "paddiangady", "madya-padav"],
    fleet: 1,
  },
  {
    id: "15i",
    number: "15I",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "katipalla"],
    fleet: 1,
  },
  {
    id: "15j",
    number: "15J",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "ashoknagar", "dambel"],
    fleet: 1,
  },
  {
    id: "15k",
    number: "15K",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-market", "marigudi", "ashoknagar", "dambel"],
    fleet: 1,
  },
  {
    id: "15l",
    number: "15L",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "katipalla"],
    fleet: null,
  },
  {
    id: "15n",
    number: "15N",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krec", "munchur", "madya-padav", "chelar-padav", "kandige"],
    fleet: 1,
  },
  {
    id: "16",
    number: "16",
    stops: ["state-bank", "car-street", "new-chitra", "kudroli", "jodupalli", "boloor", "sulthan-bathery"],
    fleet: 1,
  },
  {
    id: "16a",
    number: "16A",
    stops: ["state-bank", "car-street", "new-chitra", "kudroli", "jodupalli", "boloor", "sulthan-bathery"],
    fleet: 1,
  },
  {
    id: "16b",
    number: "16B",
    stops: ["nehru-circle", "mangaladevi", "kankanady", "jyothi", "pvs", "lalbagh", "ladyhill", "urwa-market", "vishranthi-church"],
    fleet: 1,
  },
  {
    id: "16c",
    number: "16C",
    stops: ["sulthan-bathery", "urwa-market", "ladyhill", "urwa-store", "kulur", "panjimogaru", "kavoor", "bondel", "kpt", "yeyyadi", "nanthoor", "st-agnes", "kankanady"],
    fleet: 1,
  },
  {
    id: "17",
    number: "17",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ksrtc", "kapikad", "kuntikana", "derebail", "konchady", "mullakad", "kavoor", "marakada", "kunjathbail"],
    fleet: null,
  },
  {
    id: "17b",
    number: "17B",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ksrtc", "kapikad", "kuntikana", "derebail", "konchady", "mullakad", "kavoor", "marakada", "kunjathbail"],
    fleet: 4,
  },
  {
    id: "18",
    number: "18",
    stops: ["state-bank", "pandeshwar", "hoige-bazar", "lewel", "jeppu-market", "mangaladevi-cross", "morgans-gate"],
    fleet: 2,
  },
  {
    id: "19",
    number: "19",
    stops: ["state-bank", "jyothi", "bunts-hostel", "pvs", "bg-school", "lalbagh", "ksrtc", "bejai", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel"],
    fleet: 7,
  },
  {
    id: "19-1",
    number: "19",
    stops: ["state-bank", "jyothi", "bunts-hostel", "pvs", "bg-school", "lalbagh", "ksrtc", "bejai", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel", "pachanady"],
    fleet: 2,
  },
  {
    id: "19a",
    number: "19A",
    stops: ["kankanady", "jyothi", "bunts-hostel", "pvs", "bg-school", "lalbagh", "ksrtc", "bejai", "akashvani", "kpt", "yeyyadi", "konchady", "padavinangady", "bondel"],
    fleet: 1,
  },
  {
    id: "21",
    number: "21",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "bikarnakatte", "kulshekar-chowki", "paldane", "neermarga"],
    fleet: 3,
  },
  {
    id: "21a",
    number: "21A",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "bikarnakatte", "kulshekar-chowki", "paldane", "neermarga", "ontemar", "adyar-padav", "merlapadav", "arkula-padav"],
    fleet: 1,
  },
  {
    id: "21b",
    number: "21B",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "bikarnakatte", "kulshekar-chowki", "paldane", "neermarga", "tharigudda", "konimar"],
    fleet: 1,
  },
  {
    id: "22",
    number: "22",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "bikarnakatte", "kulshekar-chowki", "kudupu", "vamanjoor", "gurupura", "gurupura-kaikamba", "moodperar", "paduperara", "kolambe", "sunkadakatte", "bajpe"],
    fleet: 3,
  },
  {
    id: "22a",
    number: "22A",
    stops: ["state-bank", "jyothi", "bunts-hostel", "mallikatte", "nanthoor", "bikarnakatte", "kulshekar-chowki", "kudupu", "vamanjoor", "gurupura", "gurupura-kaikamba", "moodperar", "paduperara", "kolambe", "sunkadakatte", "bajpe", "adyapady"],
    fleet: 1,
  },
  {
    id: "23",
    number: "23",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "capitanio", "nagori", "alape", "bajal-cross", "perla", "veeranagar", "faisal-nagar"],
    fleet: 1,
  },
  {
    id: "23b",
    number: "23B",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "capitanio", "nagori", "alape", "bajal-cross", "perla", "veeranagar", "faisal-nagar"],
    fleet: 1,
  },
  {
    id: "23c",
    number: "23C",
    stops: ["state-bank", "taj-mahal", "falnir", "kankanady", "pumpwell", "capitanio", "nagori", "alape", "bajal-cross", "perla", "veeranagar", "faisal-nagar"],
    fleet: 1,
  },
  {
    id: "27",
    number: "27",
    stops: ["state-bank", "taj-mahal", "attavara", "kmc", "nandigudda", "marnamikatta", "mangaladevi"],
    fleet: 2,
  },
  {
    id: "27a",
    number: "27A",
    stops: ["state-bank", "taj-mahal", "attavara", "kmc", "nandigudda", "marnamikatta", "mangaladevi", "mulihitlu"],
    fleet: 3,
  },
  {
    id: "29",
    number: "29",
    stops: ["state-bank", "rto", "pandeshwar", "yemmekere", "lewel", "mulihitlu", "jeppu-market", "morgans-gate"],
    fleet: 2,
  },
  {
    id: "30",
    number: "30",
    stops: ["state-bank", "jyothi", "bendoor-cross", "st-agnes", "nanthoor", "bikarnakatte", "aspinwall", "maroli", "padil"],
    fleet: 2,
  },
  {
    id: "30b",
    number: "30B",
    stops: ["state-bank", "jyothi", "bendoor-cross", "st-agnes", "nanthoor", "bikarnakatte", "aspinwall", "maroli", "padil", "bridge", "kodakal", "kannur", "adyar-jetty", "sahyadri"],
    fleet: 2,
  },
  {
    id: "31",
    number: "31",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ladyhill", "urwa-market", "marigudi", "ashoknagar", "shediguri"],
    fleet: 3,
  },
  {
    id: "31a",
    number: "31A",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ladyhill", "urwa-market", "cashew-factory", "marigudi", "ashoknagar", "shediguri"],
    fleet: 3,
  },
  {
    id: "31b",
    number: "31B",
    stops: ["state-bank", "car-street", "new-chitra", "kudroli", "mannagudda", "ladyhill", "urwa-market", "cashew-factory", "marigudi", "ashoknagar", "shediguri", "dambel"],
    fleet: 1,
  },
  {
    id: "33",
    number: "33",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ksrtc", "kapikad", "kuntikana", "derebail", "konchady", "mullakad", "akashbhavan"],
    fleet: 5,
  },
  {
    id: "33c",
    number: "33C",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ksrtc", "kapikad", "kuntikana", "derebail", "konchady", "land-links"],
    fleet: null,
  },
  {
    id: "33d",
    number: "33D",
    stops: ["land-links", "konchady-katte", "kuntikana", "kottara-chowki", "kulur", "panambur", "baikampady", "surathkal", "katipalla"],
    fleet: null,
  },
  {
    id: "37",
    number: "37",
    stops: ["state-bank", "jyothi", "bendoor-cross", "st-agnes", "nanthoor", "bikarnakatte", "aspinwall", "maroli", "padil"],
    fleet: 1,
  },
  {
    id: "41a",
    number: "41A",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "krec", "munchur", "madya-padav", "chelar-padav", "kandige", "mrpl"],
    fleet: 2,
  },
  {
    id: "42",
    number: "42",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "thokkottu-kapikad", "kolya", "kotekar", "beeri", "sankolige", "kc-road", "talapady"],
    fleet: 18,
  },
  {
    id: "43",
    number: "43",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "thokkottu-kapikad", "kolya", "kotekar", "beeri", "sankolige", "kc-road", "talapady"],
    fleet: 6,
  },
  {
    id: "43a",
    number: "43A",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "thokkottu-kapikad", "kolya", "kotekar", "beeri", "sankolige", "kc-road", "talapady", "kc-nagar", "kinya"],
    fleet: 2,
  },
  {
    id: "43b",
    number: "43B",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "thokkottu-kapikad", "kolya", "kotekar", "beeri", "sankolige", "kc-road", "talapady", "kc-nagar", "kinya"],
    fleet: 1,
  },
  {
    id: "44",
    number: "44",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "thokkottu-kapikad", "ambika-road", "kumpala", "amrithnagar"],
    fleet: 1,
  },
  {
    id: "44a",
    number: "44A",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "over-bridge", "ullal", "ombathukere", "someshwara"],
    fleet: 4,
  },
  {
    id: "44b",
    number: "44B",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "ranipura", "addu", "madaka", "tharigudde", "elyarpadav"],
    fleet: 3,
  },
  {
    id: "44c",
    number: "44C",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "over-bridge", "ullal", "kotepura", "ullal-jetty"],
    fleet: 4,
  },
  {
    id: "44d",
    number: "44D",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "over-bridge", "ullal", "kotepura", "ullal-jetty"],
    fleet: 5,
  },
  {
    id: "44e",
    number: "44E",
    stops: ["nehru-circle", "pandeshwar", "yemmekere", "lewel", "mulihitlu", "morgans-gate", "jappinamogaru", "thokkottu", "thokkottu-kapikad", "ambika-road", "kumpala", "amrithnagar"],
    fleet: 2,
  },
  {
    id: "44f",
    number: "44F",
    stops: ["mangaladevi", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "over-bridge", "ullal", "someshwara"],
    fleet: null,
  },
  {
    id: "44g",
    number: "44G",
    stops: ["kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "deralakatte", "addu", "barua", "baradka", "madaka"],
    fleet: 1,
  },
  {
    id: "44h",
    number: "44H",
    stops: ["kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "ranipura", "addu", "madaka", "tharigudde", "elyarpadav", "new-padupu", "gramachavadi"],
    fleet: 2,
  },
  {
    id: "44i",
    number: "44I",
    stops: ["surathkal", "hosabettu", "baikampady", "panambur", "kulur", "urwa-store", "ladyhill", "lalbagh", "kadri", "city-hospital", "jyothi", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "thokkottu-kapikad", "ambika-road", "kumpala", "amrithnagar"],
    fleet: null,
  },
  {
    id: "44l",
    number: "44L",
    stops: ["kottara", "urwa-store", "ladyhill", "lalbagh", "ksrtc", "bejai", "kpt", "nanthoor", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "thokkottu-kapikad", "ambika-road", "kumpala", "amrithnagar", "bagambila"],
    fleet: 1,
  },
  {
    id: "44m",
    number: "44M",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "ranipura", "addu", "madaka", "tharigudde", "elyarpadav", "konaje"],
    fleet: 1,
  },
  {
    id: "44p",
    number: "44P",
    stops: ["pavoor", "gramachavadi", "pajeer", "konaje", "natekal", "deralakatte", "thokkottu", "over-bridge", "ullal", "ombathukere", "someshwara"],
    fleet: 1,
  },
  {
    id: "44r",
    number: "44R",
    stops: ["kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "ranipura", "addu", "madaka", "tharigudde", "elyarpadav", "new-padupu", "gramachavadi", "pavoor-panchayath", "kambla-padav", "innoli"],
    fleet: 1,
  },
  {
    id: "44t",
    number: "44T",
    stops: ["kunjathbail", "marakada", "kavoor", "bondel", "kpt", "yeyyadi", "nanthoor", "st-agnes", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "over-bridge", "ullal", "ombathukere", "someshwara"],
    fleet: 2,
  },
  {
    id: "44t-2",
    number: "44T",
    stops: ["athrebail", "kunjathbail", "marakada", "kavoor", "bondel", "kpt", "yeyyadi", "nanthoor", "st-agnes", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "over-bridge", "ullal", "ombathukere", "someshwara"],
    fleet: null,
  },
  {
    id: "44q",
    number: "44Q",
    stops: ["harekala", "pavoor", "konaje", "thokkottu", "jappinamogaru", "yekkur", "pumpwell", "kankanady"],
    fleet: null,
  },
  {
    id: "45",
    number: "45",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "kana", "bala", "church-road", "katipalla-kaikamba", "katipalla", "mangalpete"],
    fleet: 1,
  },
  {
    id: "45a",
    number: "45A",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "krishnapura", "katipalla"],
    fleet: null,
  },
  {
    id: "45b",
    number: "45B",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "kana", "bala", "church-road", "katipalla-kaikamba", "katipalla", "janatha-colony"],
    fleet: 1,
  },
  {
    id: "45c",
    number: "45C",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "chokkabettu", "krishnapura", "katipalla", "katipalla-kaikamba", "mangalpete"],
    fleet: 10,
  },
  {
    id: "45d",
    number: "45D",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "chokkabettu", "krishnapura", "katipalla", "katipalla-kaikamba", "mangalpete", "kuthethuru"],
    fleet: 2,
  },
  {
    id: "45e",
    number: "45E",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "chitrapura", "kulai", "honnakatte", "kana", "bala", "katipalla-kaikamba", "katipalla", "krishnapura", "indiranagar"],
    fleet: 2,
  },
  {
    id: "45f",
    number: "45F",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "chokkabettu", "krishnapura", "katipalla", "mangalpete", "mrpl", "kaithakumeru"],
    fleet: 1,
  },
  {
    id: "45g",
    number: "45G",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "janatha-colony"],
    fleet: 3,
  },
  {
    id: "45h",
    number: "45H",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "chokkabettu", "krishnapura", "katipalla", "paddiangady", "madya-padav"],
    fleet: 2,
  },
  {
    id: "45k",
    number: "45K",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "kana", "kodikere"],
    fleet: 1,
  },
  {
    id: "47",
    number: "47",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ksrtc", "kapikad", "kuntikana", "derebail", "konchady", "mullakad", "kavoor", "marakada", "maravoor", "porkodi", "bajpe"],
    fleet: 2,
  },
  {
    id: "47a",
    number: "47A",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ksrtc", "kapikad", "kuntikana", "derebail", "konchady", "mullakad", "kavoor", "marakada", "maravoor", "porkodi", "bajpe", "bajpe-airport"],
    fleet: 1,
  },
  {
    id: "47b",
    number: "47B",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ladyhill", "urwa-store", "kulur", "panjimogaru", "kavoor", "marakada", "maravoor", "porkodi", "bajpe", "bajpe-airport", "adyapady"],
    fleet: 1,
  },
  {
    id: "47c",
    number: "47C",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "bg-school", "lalbagh", "ksrtc", "kapikad", "kuntikana", "derebail", "konchady", "mullakad", "kavoor", "marakada", "maravoor", "porkodi", "bajpe", "kathalsar"],
    fleet: 2,
  },
  {
    id: "47d",
    number: "47D",
    stops: ["kankanady", "st-agnes", "nanthoor", "kpt", "bejai", "ksrtc", "kapikad", "kuntikana", "derebail", "konchady", "mullakad", "kavoor", "marakada", "maravoor", "porkodi", "bajpe"],
    fleet: 1,
  },
  {
    id: "51",
    number: "51",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "deralakatte", "natekal", "mangalagangothri", "konaje"],
    fleet: 6,
  },
  {
    id: "51a",
    number: "51A",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "deralakatte", "natekal", "mangalagangothri", "pajeer", "gramachavadi", "pavoor", "kambla-padav", "innoli"],
    fleet: 3,
  },
  {
    id: "51b",
    number: "51B",
    stops: ["kottara", "urwa-store", "ladyhill", "lalbagh", "pvs", "jyothi", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "over-bridge", "ambika-road", "kolya", "kotekar", "beeri", "madyar", "bagambila", "natekal", "assaigoli", "mangalagangothri", "konaje"],
    fleet: 2,
  },
  {
    id: "51c",
    number: "51C",
    stops: ["mrpl", "katipalla", "kana", "surathkal", "hosabettu", "baikampady", "panambur", "kulur", "urwa-store", "ladyhill", "lalbagh", "ksrtc", "bejai", "akashvani", "nanthoor", "st-agnes", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "deralakatte", "natekal", "assaigoli", "mangalagangothri", "konaje"],
    fleet: null,
  },
  {
    id: "51d",
    number: "51D",
    stops: ["kottara", "urwa-store", "ladyhill", "lalbagh", "pvs", "jyothi", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "mangalagangothri", "pajeer", "gramachavadi", "pavoor", "kambla-padav", "innoli-padav"],
    fleet: 1,
  },
  {
    id: "51e",
    number: "51E",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "deralakatte", "natekal", "mangalagangothri", "pajeer", "kambla-padav", "mudipu", "hoovakuvakallu", "narya"],
    fleet: 2,
  },
  {
    id: "51f",
    number: "51F",
    stops: ["nehru-circle", "lewel", "pinto-gate", "jappinamogaru", "kallapu", "thokkottu", "kuthar-padav", "deralakatte", "mangalagangothri", "konaje", "nadupadav"],
    fleet: null,
  },
  {
    id: "51g",
    number: "51G",
    stops: ["baikampady", "panambur", "kulur", "urwa-store", "ladyhill", "lalbagh", "ksrtc", "bejai", "akashvani", "nanthoor", "st-agnes", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "deralakatte", "natekal", "assaigoli", "mangalagangothri", "konaje", "pajeer", "gramachavadi", "kambla-padav", "innoli", "dharmanagar"],
    fleet: 1,
  },
  {
    id: "51k",
    number: "51K",
    stops: ["kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "deralakatte", "natekal", "belaringe", "kaje", "kinya"],
    fleet: 2,
  },
  {
    id: "51t",
    number: "51T",
    stops: ["talapady", "kc-nagar", "devinagar", "kondana", "natekal", "deralakatte", "kuthar-padav", "babbukatte", "thokkottu"],
    fleet: 1,
  },
  {
    id: "51u",
    number: "51U",
    stops: ["padulikatta", "natekal", "thokkottu", "pumpwell", "kankanady"],
    fleet: null,
  },
  {
    id: "53",
    number: "53",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "kulai", "surathkal", "kana", "bala", "church-road", "katipalla-kaikamba", "katipalla", "soorinje", "tibar"],
    fleet: 2,
  },
  {
    id: "53a",
    number: "53A",
    stops: ["kankanady", "st-agnes", "nanthoor", "akashvani", "bejai", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "krishnapura", "katipalla", "soorinje", "tibar"],
    fleet: 1,
  },
  {
    id: "53b",
    number: "53B",
    stops: ["kunjathbail", "marakada", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "kana", "church-road", "katipalla", "soorinje", "shibaroor"],
    fleet: 1,
  },
  {
    id: "53c",
    number: "53C",
    stops: ["mangaladevi", "valencia", "kankanady", "st-agnes", "nanthoor", "akashvani", "ksrtc", "lalbagh", "ladyhill", "urwa-store", "kottara", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "kana", "church-road", "katipalla", "soorinje", "delanthabettu"],
    fleet: null,
  },
  {
    id: "53d",
    number: "53D",
    stops: ["porkodi", "jokatte", "kudimbur", "lamina", "baikampady", "hosabettu", "surathkal", "kana", "church-road", "katipalla", "soorinje", "shibaroor"],
    fleet: 1,
  },
  {
    id: "54",
    number: "54",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "over-bridge", "kolya", "beeri", "madoor", "madyar", "bagambila", "deralakatte", "natekal", "kalakatte", "manjanady", "mangalanthi", "montepadav", "naringana", "thoudugoli"],
    fleet: 1,
  },
  {
    id: "54a",
    number: "54A",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "deralakatte", "natekal", "kalakatte", "manjanady", "mangalanthi", "thoudugoli-cross", "montepadav", "hoovakuvakallu"],
    fleet: 2,
  },
  {
    id: "54b",
    number: "54B",
    stops: ["state-bank", "pandeshwar", "yemmekere", "mulihitlu", "morgans-gate", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "deralakatte", "natekal", "kalakatte", "manjanady", "mangalanthi", "thoudugoli-cross", "montepadav", "hoovakuvakallu"],
    fleet: 1,
  },
  {
    id: "55",
    number: "55",
    stops: ["state-bank", "jyothi", "balmatta", "kankanady", "pumpwell", "yekkur", "jappinamogaru", "thokkottu", "babbukatte", "kuthar-padav", "deralakatte", "natekal", "mangalagangothri", "konaje", "pajeer", "gramachavadi", "bavalaguri", "harekala", "pavoor"],
    fleet: 2,
  },
  {
    id: "59",
    number: "59",
    stops: ["state-bank", "vishwabhavan", "navabharath-circle", "pvs", "lalbagh", "ladyhill", "urwa-store", "kulur", "panambur", "baikampady", "chitrapura", "chitrapura-temple", "hosabettu", "surathkal"],
    fleet: 2,
  },
  {
    id: "60",
    number: "60",
    stops: ["akashbhavan", "mullakad", "konchady", "derebail", "malemar", "kottara-chowki", "urwa-store", "ladyhill", "lalbagh", "ksrtc", "bejai", "kadri-temple", "mallikatte", "kankanady", "valencia", "v-gorigudda"],
    fleet: 2,
  },
  {
    id: "60a",
    number: "60A",
    stops: ["land-links", "konchady-katte", "mullakad", "nandanpura", "akashbhavan", "kottara-chowki", "urwa-store", "ladyhill"],
    fleet: null,
  },
  {
    id: "60b",
    number: "60B",
    stops: ["akashbhavan", "mullakad", "konchady-katte", "land-links", "derebail", "malemar", "kottara-chowki", "urwa-store", "ladyhill"],
    fleet: null,
  },
  {
    id: "61",
    number: "61",
    stops: ["kodikal", "urwa-store", "ladyhill", "lalbagh", "ksrtc", "bejai", "kadri-temple", "mallikatte", "kankanady", "pumpwell", "capitanio", "padil", "railway-station"],
    fleet: 2,
  },
  {
    id: "62a",
    number: "62A",
    stops: ["railway-station", "padil", "maroli", "b-kaikamba", "bikarnakatte", "nanthoor", "kpt", "yeyyadi", "maryhill", "bondel", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "hosabettu", "surathkal", "chokkabettu", "krishnapura", "katipalla", "katipalla-kaikamba"],
    fleet: null,
  },
  {
    id: "64",
    number: "64",
    stops: ["moodushedde", "kethikal", "vamanjoor", "kudupu", "kulshekar-chowki", "gurupura-kaikamba", "nanthoor", "kpt", "yeyyadi", "padavinangady", "bondel", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "chitrapura-temple", "hosabettu", "surathkal", "chokkabettu", "krishnapura", "katipalla", "mangalpete", "kuthethuru"],
    fleet: null,
  },
  {
    id: "64a",
    number: "64A",
    stops: ["moodushedde", "kethikal", "vamanjoor", "kudupu", "kulshekar-chowki", "gurupura-kaikamba", "nanthoor", "kpt", "yeyyadi", "padavinangady", "bondel", "kavoor", "panjimogaru", "kulur", "panambur", "baikampady", "chitrapura-temple", "hosabettu", "surathkal", "chokkabettu", "krishnapura", "katipalla", "mangalpete", "kuthethuru"],
    fleet: null,
  },
  {
    id: "65",
    number: "65",
    stops: ["railway-station", "padil", "alape", "nagori", "pumpwell", "nanthoor", "kpt", "kuntikana", "kottara-chowki", "kulur", "panambur", "baikampady", "surathkal", "chokkabettu", "krishnapura", "katipalla", "katipalla-kaikamba"],
    fleet: 1,
  },
  {
    id: "65g",
    number: "65G",
    stops: ["kankanady", "pumpwell", "tharethota", "nanthoor", "kpt", "kuntikana", "kottara-chowki", "kulur", "panambur", "baikampady", "surathkal", "kana", "bala", "church-road", "katipalla-kaikamba", "katipalla", "janatha-colony"],
    fleet: 2,
  },
]

export const suggestedJourneys = [
  {
    fromId: "deralakatte",
    toId: "state-bank",
    label: "Deralakatte → State Bank",
    blurb: "City buses that pass Deralakatte, including the Yenepoya road.",
  },
  {
    fromId: "state-bank",
    toId: "kankanady",
    label: "State Bank → Kankanady",
    blurb: "A short hop from the State Bank stand to Kankanady.",
  },
  {
    fromId: "bejai",
    toId: "state-bank",
    label: "Bejai → State Bank",
    blurb: "From Bejai back to the Hampankatta stand.",
  },
  {
    fromId: "state-bank",
    toId: "kottara",
    label: "State Bank → Kottara",
    blurb: "North through Lady Hill and Urwa Store.",
  },
  {
    fromId: "state-bank",
    toId: "surathkal",
    label: "State Bank → Surathkal",
    blurb: "The ride up the coast toward Surathkal.",
  },
  {
    fromId: "state-bank",
    toId: "bajpe-airport",
    label: "State Bank → Airport",
    blurb: "City buses that reach Bajpe airport.",
  },
] as const
```

### `src/lib/geo.ts`

```ts
export type LatLng = { lat: number; lng: number }

const EARTH_KM = 6371

function toRad(degrees: number) {
  return (degrees * Math.PI) / 180
}

/** Where `point` falls on the straight line from `start` to `end`. `t` is 0 at the start and 1 at the end. */
export function segmentOffset(point: LatLng, start: LatLng, end: LatLng) {
  const lat0 = (((start.lat + end.lat) / 2) * Math.PI) / 180
  const kx = Math.cos(lat0) * 111.32
  const ky = 110.57
  const px = (point.lng - start.lng) * kx
  const py = (point.lat - start.lat) * ky
  const bx = (end.lng - start.lng) * kx
  const by = (end.lat - start.lat) * ky
  const len2 = bx * bx + by * by
  if (len2 < 1e-8) return { t: 0, km: haversineKm(point, start) }
  const raw = (px * bx + py * by) / len2
  const t = Math.max(0, Math.min(1, raw))
  const foot = {
    lat: start.lat + (end.lat - start.lat) * t,
    lng: start.lng + (end.lng - start.lng) * t,
  }
  return { t, km: haversineKm(point, foot) }
}

export function haversineKm(a: LatLng, b: LatLng) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

const ROAD_FACTOR = 1.2
const SPEED_KMH = 20
const DWELL_MIN = 0.6

export function rideBetween(points: LatLng[]) {
  let crowKm = 0
  for (let i = 1; i < points.length; i++) {
    crowKm += haversineKm(points[i - 1], points[i])
  }
  const distanceKm = Math.round(crowKm * ROAD_FACTOR * 10) / 10
  const moving = (distanceKm / SPEED_KMH) * 60
  const dwell = Math.max(0, points.length - 2) * DWELL_MIN
  const minutes = Math.max(points.length > 1 ? 4 : 0, Math.round(moving + dwell))
  return { distanceKm, minutes }
}
```

### `src/lib/format.ts`

```ts
export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`
}

export function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(km < 10 ? 1 : 0)} km`
}

export function formatMeters(meters: number) {
  if (meters < 1000) {
    return `${Math.max(10, Math.round(meters / 10) * 10)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export function indicativeFare(km: number) {
  const raw = 8 + km * 1.6
  return Math.max(10, Math.round(raw / 2) * 2)
}

export function formatInr(amount: number) {
  return `₹${amount}`
}
```

### `src/lib/bus-service.ts`

```ts
import { buses, type Bus } from "@/data/buses"
import { stopById, stops, type Stop } from "@/data/stops"
import { haversineKm, rideBetween, segmentOffset } from "@/lib/geo"

export type Journey = {
  bus: Bus
  from: Stop
  to: Stop
  stops: Stop[]
  minutes: number
  distanceKm: number
  reversed: boolean
  /** A searched place sits on the road between chart stops, but the chart did not name it. */
  alongRoad: boolean
  passed: string[]
}

export type StopMatch = {
  status: "empty" | "none" | "match" | "ambiguous"
  stop?: Stop
  suggestions: Stop[]
}

for (const bus of buses) {
  const seen = new Set<string>()
  for (const id of bus.stops) {
    if (!stopById.has(id)) {
      throw new Error(`Bus ${bus.number} references unknown stop "${id}"`)
    }
    if (seen.has(id)) {
      throw new Error(`Bus ${bus.number} lists "${id}" twice`)
    }
    seen.add(id)
  }
  if (bus.stops.length < 2) {
    throw new Error(`Bus ${bus.number} needs at least two stops`)
  }
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function scoreStop(stop: Stop, query: string) {
  const name = normalize(stop.name)
  const id = normalize(stop.id.replace(/-/g, " "))
  const fields = [name, id, ...stop.aliases.map(normalize)]
  if (fields.some((field) => field === query)) return 100
  if (fields.some((field) => field.startsWith(query))) return 86
  const tokens = query.split(" ")
  if (
    tokens.length > 1 &&
    tokens.every((token) => fields.some((field) => field.includes(token)))
  ) {
    return 74
  }
  if (fields.some((field) => field.includes(query))) return 64
  return 0
}

export function searchStops(query: string, limit = 8) {
  const normalized = normalize(query)
  if (!normalized) return []
  // One letter means "places that start with this", such as v → Valencia, Valachil.
  const minimumScore = normalized.length === 1 ? 86 : 1
  return stops
    .map((stop) => ({ stop, score: scoreStop(stop, normalized) }))
    .filter((entry) => entry.score >= minimumScore)
    .sort((a, b) => b.score - a.score || a.stop.name.localeCompare(b.stop.name))
    .slice(0, limit)
    .map((entry) => entry.stop)
}

export function resolveStop(query: string): StopMatch {
  const normalized = normalize(query)
  if (!normalized) return { status: "empty", suggestions: [] }

  const ranked = stops
    .map((stop) => ({ stop, score: scoreStop(stop, normalized) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.stop.name.localeCompare(b.stop.name))

  if (ranked.length === 0 || ranked[0].score < 50) {
    return { status: "none", suggestions: ranked.slice(0, 5).map((entry) => entry.stop) }
  }

  const [top, second] = ranked
  const exactAndUnique = top.score >= 100 && (!second || second.score < 100)
  const clearLeader = top.score >= 80 && (!second || top.score - second.score >= 20)
  if (exactAndUnique || clearLeader) {
    return { status: "match", stop: top.stop, suggestions: [] }
  }

  const suggestions = ranked
    .filter((entry) => entry.score >= top.score - 15 && entry.score >= 50)
    .slice(0, 5)
    .map((entry) => entry.stop)

  if (suggestions.length === 1) {
    return { status: "match", stop: suggestions[0], suggestions: [] }
  }

  return { status: "ambiguous", suggestions }
}

export function getStop(id: string) {
  return stopById.get(id)
}

export function getAllStops() {
  return [...stops].sort((a, b) => a.name.localeCompare(b.name))
}

export function compareBusNumbers(a: string, b: string) {
  const parse = (value: string) => {
    const match = value.match(/^(\d+)(.*)$/i)
    if (!match) return { n: Number.MAX_SAFE_INTEGER, rest: value }
    return { n: Number(match[1]), rest: match[2] }
  }
  const left = parse(a)
  const right = parse(b)
  if (left.n !== right.n) return left.n - right.n
  return left.rest.localeCompare(right.rest)
}

export function getAllBuses() {
  return [...buses].sort((a, b) => compareBusNumbers(a.number, b.number))
}

export function getBus(numberOrId: string) {
  const key = numberOrId.trim().toLowerCase().replace(/\s+/g, "")
  const byId = buses.find((bus) => bus.id === key)
  if (byId) return byId
  const byNumber = buses.filter((bus) => bus.number.toLowerCase() === key)
  return byNumber.length === 1 ? byNumber[0] : undefined
}

export function normalizeBusQuery(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "")
}

export function busesWithNumber(query: string) {
  const key = normalizeBusQuery(query)
  if (!key) return []
  return buses
    .filter((bus) => bus.number.toUpperCase() === key)
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function busRouteLabel(bus: Bus) {
  const from = stopById.get(bus.stops[0])?.name ?? ""
  const to = stopById.get(bus.stops[bus.stops.length - 1])?.name ?? ""
  return `${from} → ${to}`
}

export function stopNames(ids: string[]) {
  return ids.map((id) => stopById.get(id)?.name ?? id)
}

export function redirectedRoads(bus: Bus) {
  const roads = busesWithNumber(bus.number)
  if (roads.length < 2) return []
  const mine = new Set(bus.stops)
  return roads
    .filter((other) => other.id !== bus.id)
    .map((other) => {
      const theirs = new Set(other.stops)
      return {
        bus: other,
        onlyHere: stopNames(bus.stops.filter((id) => !theirs.has(id))),
        onlyThere: stopNames(other.stops.filter((id) => !mine.has(id))),
      }
    })
}

export function matchBuses(query: string) {
  const key = normalizeBusQuery(query)
  if (!key) return []
  const exact = busesWithNumber(key)
  if (exact.length > 0) return exact
  return buses
    .filter((bus) => bus.number.toUpperCase().startsWith(key))
    .sort((a, b) => compareBusNumbers(a.number, b.number))
}

function stopsFromIds(ids: string[]) {
  return ids.map((id) => {
    const stop = stopById.get(id)
    if (!stop) throw new Error(`Missing stop ${id}`)
    return stop
  })
}

function toJourney(
  bus: Bus,
  orderedIds: string[],
  reversed: boolean,
  alongRoad = false,
  passed: string[] = [],
): Journey {
  const ordered = stopsFromIds(orderedIds)
  const ride = rideBetween(ordered)
  return {
    bus,
    from: ordered[0],
    to: ordered[ordered.length - 1],
    stops: ordered,
    minutes: ride.minutes,
    distanceKm: ride.distanceKm,
    reversed,
    alongRoad,
    passed,
  }
}

export function fullJourney(bus: Bus) {
  return toJourney(bus, bus.stops, false)
}

/** Smaller places within this distance of the road still count, even when the chart skipped them. */
const CORRIDOR_KM = 0.35

function placement(bus: Bus, stopId: string) {
  const named = bus.stops.indexOf(stopId)
  if (named !== -1) return { index: named, named: true }
  const stop = stopById.get(stopId)
  if (!stop) return null
  let best: { index: number; km: number } | null = null
  for (let i = 0; i < bus.stops.length - 1; i++) {
    const start = stopById.get(bus.stops[i])
    const end = stopById.get(bus.stops[i + 1])
    if (!start || !end) continue
    const { t, km } = segmentOffset(stop, start, end)
    if (t <= 0.05 || t >= 0.95 || km > CORRIDOR_KM) continue
    if (!best || km < best.km) best = { index: i + t, km }
  }
  return best ? { index: best.index, named: false } : null
}

export function segmentJourney(bus: Bus, fromId: string, toId: string) {
  const fromPlace = placement(bus, fromId)
  const toPlace = placement(bus, toId)
  if (!fromPlace || !toPlace) return null
  if (Math.abs(fromPlace.index - toPlace.index) < 0.2) return null
  const reversed = fromPlace.index > toPlace.index
  const lo = Math.min(fromPlace.index, toPlace.index)
  const hi = Math.max(fromPlace.index, toPlace.index)
  const start = Math.floor(lo)
  const end = Math.min(bus.stops.length - 1, Math.ceil(hi))
  const ids = bus.stops.slice(start, end + 1)
  const passed: string[] = []
  for (const extra of [
    { id: fromId, index: fromPlace.index, named: fromPlace.named },
    { id: toId, index: toPlace.index, named: toPlace.named },
  ]) {
    if (extra.named || ids.includes(extra.id)) continue
    let at = ids.length
    for (let i = 0; i < ids.length; i++) {
      if (start + i > extra.index) {
        at = i
        break
      }
    }
    ids.splice(at, 0, extra.id)
    passed.push(extra.id)
  }
  if (reversed) ids.reverse()
  if (ids.length < 2 || ids[0] === ids[ids.length - 1]) return null
  return toJourney(bus, ids, reversed, passed.length > 0, passed)
}

export function findRoutes(fromId: string, toId: string) {
  if (fromId === toId) return []
  const journeys: Journey[] = []
  for (const bus of buses) {
    const journey = segmentJourney(bus, fromId, toId)
    if (journey) journeys.push(journey)
  }
  return journeys.sort(
    (a, b) =>
      Number(a.alongRoad) - Number(b.alongRoad) ||
      a.minutes - b.minutes ||
      a.stops.length - b.stops.length ||
      compareBusNumbers(a.bus.number, b.bus.number),
  )
}

export function busesThroughStop(stopId: string) {
  return buses
    .filter((bus) => bus.stops.includes(stopId))
    .sort((a, b) => compareBusNumbers(a.number, b.number))
}

export function routeSlug(fromId: string, toId: string) {
  return `${fromId}-to-${toId}`
}

export function parseRouteSlug(slug: string) {
  const marker = "-to-"
  const index = slug.indexOf(marker)
  if (index <= 0) return null
  const from = stopById.get(slug.slice(0, index))
  const to = stopById.get(slug.slice(index + marker.length))
  if (!from || !to || from.id === to.id) return null
  return { from, to }
}

export function nearestStops(lat: number, lng: number, count = 3) {
  return stops
    .map((stop) => ({
      stop,
      meters: haversineKm({ lat, lng }, stop) * 1000,
    }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, count)
}

export function busEndpoints(bus: Bus) {
  const origin = stopById.get(bus.stops[0])
  const destination = stopById.get(bus.stops[bus.stops.length - 1])
  if (!origin || !destination) {
    throw new Error(`Bus ${bus.number} is missing an endpoint`)
  }
  return { origin, destination }
}

export function osmDirectionsUrl(from: Stop, to: Stop) {
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${from.lat}%2C${from.lng}%3B${to.lat}%2C${to.lng}`
}
```

### `src/lib/search-results.ts`

```ts
import { findRoutes, getStop, nearestStops, type Journey } from "@/lib/bus-service"

export type ResultCard = {
  id: string
  busId: string
  number: string
  fleet: number | null
  reversed: boolean
  minutes: number
  fromId: string
  toId: string
  fromName: string
  toName: string
  via: string[]
  nearby: boolean
  alongRoad: boolean
}

function viaNames(names: string[]) {
  if (names.length <= 4) return names
  const mid = Math.floor(names.length / 2)
  return [names[0], names[Math.max(1, Math.floor(mid / 2))], names[mid], names[names.length - 1]]
}

function toCard(journey: Journey, nearby: boolean): ResultCard {
  return {
    id: `${journey.bus.id}:${journey.from.id}:${journey.to.id}`,
    busId: journey.bus.id,
    number: journey.bus.number,
    fleet: journey.bus.fleet,
    reversed: journey.reversed,
    minutes: journey.minutes,
    fromId: journey.from.id,
    toId: journey.to.id,
    fromName: journey.from.name,
    toName: journey.to.name,
    via: viaNames(journey.stops.map((stop) => stop.name)),
    nearby,
    alongRoad: journey.alongRoad,
  }
}

function nearbyJourneys(fromId: string, toId: string) {
  const from = getStop(fromId)
  const to = getStop(toId)
  if (!from || !to) return []
  const around = (id: string, lat: number, lng: number) =>
    nearestStops(lat, lng, 5)
      .map((item) => item.stop.id)
      .filter((stopId) => stopId !== id)
      .slice(0, 2)
  const fromNear = around(from.id, from.lat, from.lng)
  const toNear = around(to.id, to.lat, to.lng)
  const pairs = [
    ...toNear.map((id) => [from.id, id] as const),
    ...fromNear.map((id) => [id, to.id] as const),
  ]
  const seen = new Set<string>()
  const journeys: Journey[] = []
  for (const [start, end] of pairs) {
    if (start === end) continue
    for (const journey of findRoutes(start, end)) {
      const key = `${journey.bus.id}:${journey.from.id}:${journey.to.id}`
      if (seen.has(key)) continue
      seen.add(key)
      journeys.push(journey)
    }
  }
  return journeys
}

export function resultCards(fromId: string, toId: string) {
  const exact = findRoutes(fromId, toId).map((journey) => toCard(journey, false))
  const exactKeys = new Set(exact.map((card) => card.id))
  const nearby = nearbyJourneys(fromId, toId)
    .map((journey) => toCard(journey, true))
    .filter((card) => !exactKeys.has(card.id))
  return [...exact, ...nearby]
}
```

### `src/lib/recent-searches.ts`

```ts
export type RecentSearch = {
  id: string
  label: string
  href: string
  at: number
}

const KEY = "locano.recent"
export const RECENT_EVENT = "locano-recent"

function isRecent(value: unknown): value is RecentSearch {
  if (!value || typeof value !== "object") return false
  const item = value as Partial<RecentSearch>
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.href === "string" &&
    item.href.startsWith("/") &&
    typeof item.at === "number"
  )
}

export function readRecent(): RecentSearch[] {
  if (typeof window === "undefined") return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]") as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRecent).slice(0, 6)
  } catch {
    return []
  }
}

export function pushRecent(item: Omit<RecentSearch, "at">) {
  if (typeof window === "undefined") return
  const next = [
    { ...item, at: Date.now() },
    ...readRecent().filter((entry) => entry.id !== item.id),
  ].slice(0, 6)
  window.localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(RECENT_EVENT))
}

export function clearRecent() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(RECENT_EVENT))
}

export function formatAgo(at: number) {
  const minutes = Math.max(0, Date.now() - at) / 60000
  if (minutes < 1) return "Just now"
  if (minutes < 60) {
    const rounded = Math.round(minutes)
    return `${rounded} min ago`
  }
  const hours = minutes / 60
  if (hours < 24) {
    const rounded = Math.round(hours)
    return rounded === 1 ? "1 hour ago" : `${rounded} hours ago`
  }
  const days = hours / 24
  if (days < 2) return "1 day ago"
  if (days < 7) return `${Math.round(days)} days ago`
  if (days < 14) return "1 week ago"
  const weeks = Math.round(days / 7)
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
}
```

### `src/lib/utils.ts`

```ts
export { cn } from "cn"
```

