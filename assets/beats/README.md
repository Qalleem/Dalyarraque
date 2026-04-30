# Emine Type Beat — Ücretsiz Beat'ler

Bu klasör QVLLEN BOOTH **KÜTÜPHANE** drawer'ında listelenen ücretsiz beat'leri tutar.

## Beklenen dosyalar

`index.html` içindeki `BEAT_LIBRARY` sabiti şu yolları çağırır:

```
emine-type-beat-1.mp3   # 92 BPM · Am — Sessiz Şehir
emine-type-beat-2.mp3   # 140 BPM · Em — Yüksek Tansiyon
emine-type-beat-3.mp3   # 75 BPM · Cm — Geceyarısı
emine-type-beat-4.mp3   # 128 BPM · Gm — Gri Bulvar
emine-type-beat-5.mp3   # 100 BPM · Dm — Sahil
```

## Encode spesifikasyonu (mobil PWA için optimum)

| Parametre   | Değer                    | Gerekçe                              |
|-------------|--------------------------|--------------------------------------|
| Format      | MP3 (CBR)                | Web Audio native decode              |
| Bitrate     | **128 kbps**             | ~1 MB/dk — kalite/boyut sweet spot   |
| Sample rate | 44.1 kHz                 | Resample yok                         |
| Kanal       | Stereo                   | Beat layering korunur                |
| Süre        | 60–90 sn                 | Loop'a yeter, ~1–1.5 MB              |
| Loudness    | -14 LUFS · peak ≤ -1 dBFS| Vokal headroom                       |
| ID3         | Stripped                 | Boyut + gizlilik                     |

## Encode komutu

```bash
ffmpeg -i kaynak.wav -c:a libmp3lame -b:a 128k -ar 44100 -ac 2 \
  -af "loudnorm=I=-14:TP=-1:LRA=11" -map_metadata -1 \
  emine-type-beat-1.mp3
```

## Yeni beat ekleme

1. MP3'ü yukarıdaki spesifikasyonla encode et, bu klasöre koy.
2. `index.html` → `BEAT_LIBRARY` array'ine yeni obje ekle (`id`, `title`, `file`, `bpm`, `key`).
3. `sw.js` → `CACHE_VERSION` artır.
4. Commit + push → Vercel otomatik deploy.

## Cache stratejisi

- `vercel.json` → `Cache-Control: public, max-age=31536000, immutable`
- `sw.js` → `qvllen-beats-v1` runtime cache (cache-first, lazy fetch)
- Precache'e dahil **değil** — PWA install hızı korunur.
