# QVLLEN BOOTH v5

[![Deploy](https://github.com/Qalleem/Dalyarraque/actions/workflows/static.yml/badge.svg)](https://github.com/Qalleem/Dalyarraque/actions/workflows/static.yml)

## 🔴 Canlı Uygulama

**https://qalleem.github.io/Dalyarraque/**

> Her `main` branch güncellemesi otomatik olarak bu adrese deploy edilir (GitHub Actions, ~1-2 dk).

---

## Özellikler

- 🎵 Beat yükle, oynat, **±12 yarı ton pitch shift** (♭/♯)
- 🎙 Multi-take vokal kaydı (max 10 take, IndexedDB kalıcılık)
- 🔁 One Breath v2 — VAD + tonal match + otomatik geçiş
- ⏱ **Bar-lock** kayıt başlangıcı, **Tap Tempo**, **Beat Grid** overlay
- 🖱 **Timeline scrubbing** (ruler'a tıkla/dokun → seek)
- ⌨️ **Klavye kısayolları** (Space, R, B, S, 1-9, ↑↓, M, Del)
- 📱 **PWA** — Ana Ekrana Ekle, çevrimdışı çalışır
- 🎛 FX zinciri: Gate · Comp · EQ · De-esser · Saturation · Reverb · Delay · NY Parallel · Air Exciter
- 🤖 ElevenLabs AI ses devamı
- 📦 Mix WAV + stem export, Bluetooth latency comp

## Klavye Kısayolları

| Tuş | Eylem |
|-----|-------|
| `Space` | Oynat / Durdur |
| `R` | Kayıt başlat/durdur |
| `B` | Beat oynat/durdur |
| `S` / `Esc` | Her şeyi durdur |
| `1`–`9` | Take seç |
| `↑` / `↓` | Take gezin |
| `M` | Seçili take mute |
| `Delete` | Seçili take sil |

## Teknoloji

Web Audio API · MediaRecorder · AudioWorklet · IndexedDB · Service Worker (PWA)

## Geliştirme

Tüm uygulama tek dosya: `index.html`

```
main branch → GitHub Actions → GitHub Pages (otomatik deploy)
```
