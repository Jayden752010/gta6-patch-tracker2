GTA VI PATCH TRACKER — INSTALLATIEHANDLEIDING

WAT JE KRIJGT
- Een strakke, installeerbare webapp (PWA).
- Alleen officiële GTA VI Launch Updates van Rockstar.
- Patcharchief, zoekfunctie en detailpagina per update.
- Geen pushmeldingen en geen notificatie-abonnement.
- GitHub Actions controleert de Rockstar-pagina ongeveer elke 30 minuten.
- De app ververst de patchlijst wanneer je hem opent of op 'Updates verversen' tikt.

STAP 1 — INSTALLEER DE BENODIGDHEDEN
1. Installeer Node.js LTS: https://nodejs.org/
2. Maak gratis een GitHub-account: https://github.com/
3. Download en installeer Visual Studio Code: https://code.visualstudio.com/

STAP 2 — TEST OP JE WINDOWS-PC
1. Pak GTA6-Patch-Tracker.zip uit.
2. Open de uitgepakte map in Visual Studio Code.
3. Kies Terminal > New Terminal.
4. Voer uit:
   npm install
   npm run dev
5. Open de lokale URL die Vite toont, meestal http://localhost:5173

STAP 3 — ZET DE APP OP GITHUB
1. Maak op GitHub een nieuwe repository, bijvoorbeeld gta6-patch-tracker.
2. Zet de repository op Public (GitHub Pages is dan gratis beschikbaar).
3. Upload alle bestanden en mappen uit deze projectmap naar de repository.
   Zorg dat ook de verborgen map .github wordt geüpload.
4. Open Settings > Pages.
5. Kies bij Build and deployment: GitHub Actions.
6. Open Actions en start 'Update GTA 6 patches and publish app' met Run workflow.
7. Wacht tot de workflow groen is. Open daarna de Pages-URL die GitHub toont bij Settings > Pages.
8. De workflow controleert daarna ongeveer iedere 30 minuten automatisch de Rockstar-pagina.

STAP 4 — ZET DE APP OP JE IPHONE
1. Open de GitHub Pages-URL in Safari op je iPhone.
2. Tik op de Deel-knop (vierkant met pijltje omhoog).
3. Kies 'Zet op beginscherm' / 'Add to Home Screen'.
4. Geef de app de naam GTA VI.
5. Tik op Voeg toe.
De app staat nu als icoon op je beginscherm.

BELANGRIJK
- Dit is een PWA/webapp die als app op je beginscherm werkt. Je hoeft niet via de App Store te installeren.
- Zonder pushmeldingen krijg je geen melding op je lockscreen. De patchlijst wordt bijgewerkt op de server en opnieuw ingelezen als je de app opent of handmatig ververst.
- GitHub Actions is afhankelijk van GitHub's beschikbaarheid en geplande runs kunnen soms later starten.
- Rockstar kan de HTML-indeling veranderen. Controleer na de eerste run of de patches.json-bestanden echte patchregels bevatten. De scraper bewaart het oude archief als de bron niet goed uitgelezen kan worden.
- Rockstar publiceert niet bij iedere update een apart versienummer. De app verzint geen versienummers; in dat geval toont hij de datum/categorie.
- De officiële bron is de Rockstar Support-pagina die in de app gelinkt staat.
