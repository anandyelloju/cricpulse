# CricPulse - Free Online Cricket Score Calculator & Live Scoring App

CricPulse is a mobile-first **cricket score calculator**, **live cricket scoring** tool, and **online cricket scorer** for local matches, school tournaments, box cricket, practice games, and friendly fixtures. It gives scorers a fast **cricket scoring app** experience with match setup, toss decisions, innings management, ball-by-ball controls, over history, and printable scorecards.

## Features

- Live cricket scoring for runs, wickets, wides, no balls, byes, and leg byes.
- Toss system with bat-first or bowl-first decision flow.
- Innings management for limited-over cricket matches.
- Over history and recent ball tracking.
- Batting scorecard, bowling scorecard, strike rate, economy rate, and run rate.
- Printable PDF-style scorecards from the match summary screen.
- Mobile-first scoring controls for fast one-handed use.
- LocalStorage support for restoring match state in the browser.

## Screenshots

Screenshots can be added to `assets/screenshots/` as the UI evolves.

| Match setup | Live scoring | Match summary |
| --- | --- | --- |
| `assets/screenshots/setup.png` | `assets/screenshots/live.png` | `assets/screenshots/summary.png` |

## Mobile-First Features

CricPulse is designed around real scoring conditions where the scorer may be standing near the boundary, using one hand, and recording deliveries quickly. The UI uses large tap targets, sticky live score panels, persistent scoring controls, and simple forms for team and player setup.

## Cricket Scoring Engine Features

- Legal ball and over tracking.
- Batter strike rotation.
- Wicket handling and next batter selection.
- Bowler changes between overs.
- Extras handling for wides, no balls, byes, and leg byes.
- Innings completion and match result calculation.
- Match replay setup from previous team and player data.

## Installation

Clone the repository:

```bash
git clone https://github.com/anandyelloju/cricpulse.git
cd cricpulse
```

Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## Usage

1. Open `index.html`.
2. Enter team names, overs, and player count.
3. Run the toss and choose whether the winning team bats or bowls first.
4. Select striker, non-striker, and opening bowler.
5. Start the match and score every ball from the live scoring screen.
6. Review the final scorecard and print or save the match summary.

## SEO-Friendly FAQ

### How do I calculate cricket score online?

Use CricPulse to set up teams and overs, then tap the correct run, extra, or wicket button after every delivery. The app calculates score, wickets, overs, run rate, batting stats, bowling stats, and over history automatically.

### How does cricket run rate work?

Cricket run rate is total runs divided by overs faced. For example, 60 runs in 10 overs equals a run rate of 6.00. CricPulse calculates run rate during live cricket scoring.

### How are wides and no balls calculated?

A wide or no ball normally adds one extra run to the batting team and does not count as a legal ball. CricPulse also supports additional runs on wides and no balls.

### Is CricPulse useful for local cricket?

Yes. CricPulse is built as a local cricket scoring app for casual matches, school games, society cricket, box cricket, and small tournaments.

## Keywords

CricPulse is relevant for searches around cricket score calculator, cricket scoring app, online cricket scorer, live cricket scoring, cricket scorecard app, cricket run rate calculator, local cricket scoring app, cricket extras guide, and mobile cricket scorer.

## Tech Stack

- HTML
- Tailwind CSS
- Vanilla JavaScript modules
- LocalStorage
- PWA manifest
- JSON-LD structured data

## Project Structure

```text
.
|-- index.html
|-- manifest.json
|-- robots.txt
|-- sitemap.xml
|-- assets/
|-- data/
|-- js/
`-- pages/
    |-- live.html
    |-- summary.html
```

## Contribution

Contributions are welcome. Useful areas include scoring rule improvements, accessibility testing, mobile UI refinements, cricket guide content, and automated tests for scoring flows.

## License

Add a license file before public production release.

## Maintainer

Developed and maintained by [Anand Yelloju](https://github.com/anandyelloju).
