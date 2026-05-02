export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).json({
      ok: false,
      error: 'missing_openai_api_key',
      message: 'OPENAI_API_KEY sunucu ortamında tanımlı değil.'
    });
  }

  const { text, mode = 'lyrics' } = req.body || {};
  if (!text || !String(text).trim()) {
    return res.status(400).json({
      ok: false,
      error: 'missing_input',
      message: 'text alanı zorunludur.'
    });
  }

  const safeMode = ['lyrics', 'flow', 'punchline', 'rhyme', 'one_breath'].includes(mode) ? mode : 'lyrics';

  const systemPrompt = `Sen Türkçe rap koçusun. Kullanıcıya net, uygulanabilir ve motive edici geri bildirim ver.
Her zaman TÜRKÇE yanıt ver.
Yanıtı şu başlıklarla üret:
1) Genel değerlendirme
2) Kafiye gücü
3) Flow / ritim önerileri
4) Punchline geliştirme
5) Daha iyi alternatif satırlar
6) Kısa uygulanabilir aksiyon planı
Kısa, somut ve pratik ol. Hakaret etme.
Mutlaka uygulanabilir öneriler ver; genel geçer konuşma yapma.
Çıktı sonunda 'Uygulamalı Kullanım' başlığı aç ve kullanıcıya verdiğin önerileri 8 bar örnek üzerinde adım adım uygula.
'Uygulamalı Kullanım' içinde şunlar kesin olsun:
- 2 satır mevcut hali
- 2 satır iyileştirilmiş hali
- Neden daha iyi olduğu
- 15 dakikalık mini çalışma planı.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Mod: ${safeMode}\n\nMetin/Not:\n${String(text).slice(0, 4000)}`
          }
        ]
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: 'openai_api_failure',
        message: 'OpenAI isteği başarısız oldu.',
        detail: data?.error?.message || data || null
      });
    }

    const report = data?.choices?.[0]?.message?.content?.trim();
    if (!report) {
      return res.status(502).json({
        ok: false,
        error: 'empty_model_response',
        message: 'Modelden boş yanıt alındı.'
      });
    }

    return res.status(200).json({ ok: true, mode: safeMode, report });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'server_runtime_error',
      message: 'Sunucu tarafında beklenmeyen bir hata oluştu.',
      detail: error?.message || String(error)
    });
  }
}
