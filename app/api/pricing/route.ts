const countryCurrency: Record<string, string> = {
  IN:'INR',US:'USD',GB:'GBP',CA:'CAD',AU:'AUD',NZ:'NZD',DE:'EUR',FR:'EUR',ES:'EUR',IT:'EUR',
  NL:'EUR',IE:'EUR',AT:'EUR',BE:'EUR',PT:'EUR',FI:'EUR',GR:'EUR',JP:'JPY',SG:'SGD',AE:'AED',
  CH:'CHF',SE:'SEK',NO:'NOK',DK:'DKK',PL:'PLN',CZ:'CZK',HU:'HUF',RO:'RON',BR:'BRL',MX:'MXN',
  ZA:'ZAR',KR:'KRW',HK:'HKD',MY:'MYR',TH:'THB',ID:'IDR',PH:'PHP',TR:'TRY',IL:'ILS',
};

export async function GET(request: Request) {
  const cf = (request as Request & { cf?: { country?: string } }).cf;
  const headerCountry =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry');
  const country = (headerCountry || cf?.country || 'IN').toUpperCase();
  const currency = countryCurrency[country] || 'USD';
  let rate = currency === 'INR' ? 1 : 0;
  if (!rate) {
    try {
      const response = await fetch(`https://api.frankfurter.dev/v2/rate/INR/${currency}`, {
        headers: { accept: 'application/json' },
      });
      if (response.ok) rate = Number(((await response.json()) as { rate?: number }).rate);
    } catch {}
  }
  if (!Number.isFinite(rate) || rate <= 0) {
    rate = currency === 'USD' ? 0.012 : 1;
    return Response.json({ country, currency: rate === 1 ? 'INR' : 'USD', rate, approximate: true }, {
      headers: {
        'Cache-Control': 'private, max-age=3600',
        Vary: 'X-Vercel-IP-Country, CF-IPCountry',
      },
    });
  }
  return Response.json({ country, currency, rate, approximate: currency !== 'INR' }, {
    headers: {
      'Cache-Control': 'private, max-age=21600',
      Vary: 'X-Vercel-IP-Country, CF-IPCountry',
    },
  });
}
