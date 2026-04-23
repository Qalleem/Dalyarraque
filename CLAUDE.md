# QVLLEN BOOTH — Claude Çalışma Kuralları

## Deploy Akışı (Değişmez Kural)

Her kod değişikliğinde:
1. Değişikliği yap
2. `git add` + `git commit` (açıklayıcı mesaj)
3. `git push origin main` — direkt main'e
4. GitHub Pages otomatik deploy eder (~1 dk)
5. Kullanıcıya sadece canlı URL'i ver: https://qalleem.github.io/Dalyarraque/

**PR açma, branch oluşturma, merge onayı isteme — YOK.**
**Kullanıcıdan "push et" veya "canlıya al" hatırlatması bekleme — YOK.**

## Proje Bilgisi

- Tek dosya mimarisi: `index.html` (tüm HTML/CSS/JS)
- PWA: `sw.js` + `manifest.json`
- Font: Inter + IBM Plex Mono + Bebas Neue
- Tema: Premium navy/mavi (#070c18 arkaplan, #2979ff accent)
- Dil: Türkçe UI
