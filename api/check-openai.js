export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return res.status(500).json({
      ok: false,
      status: 'missing_env',
      required: 'OPENAI_API_KEY',
      message: 'OPENAI_API_KEY is not set in Vercel Environment Variables.'
    });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`
      }
    });

    if (!response.ok) {
      let detail = null;
      try {
        detail = await response.json();
      } catch (_) {}

      return res.status(response.status).json({
        ok: false,
        status: 'openai_rejected_key',
        httpStatus: response.status,
        message: 'OPENAI_API_KEY exists, but OpenAI rejected it.',
        detail
      });
    }

    return res.status(200).json({
      ok: true,
      status: 'ready',
      message: 'OPENAI_API_KEY is set and accepted by OpenAI.'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 'network_or_runtime_error',
      message: 'Could not verify OPENAI_API_KEY from the Vercel function.',
      error: error?.message || String(error)
    });
  }
}
