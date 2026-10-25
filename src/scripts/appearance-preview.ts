import { appearanceCss, customColorContrast, type ColorOverrides } from '../lib/appearance';

if (new URLSearchParams(location.search).has('editor-preview') && parent !== window) {
  const allowed = new Set([location.origin, 'https://taylorstechsolutions.com', 'https://www.taylorstechsolutions.com', 'https://taylorstechsite-5982d.web.app', 'https://taylorstechsite-5982d.firebaseapp.com']);
  window.addEventListener('message', event => {
    if (event.source !== parent || !allowed.has(event.origin) || event.data?.type !== 'jaclyn-appearance-preview') return;
    const input = event.data.appearance;
    if (!input || typeof input !== 'object' || !['olive', 'ink', 'plum', 'clay'].includes(input.palette)) return;
    const colors: ColorOverrides = {};
    for (const key of ['customBackground', 'customText', 'customAccent', 'customDarkBackground', 'customDarkText', 'customDarkAccent'] as const) {
      if (typeof input[key] !== 'string' || !/^(?:#[0-9a-fA-F]{6})?$/.test(input[key])) return;
      colors[key] = input[key];
    }
    if (customColorContrast(input.palette, colors).some(check => check.ratio < 4.5)) return;
    const root = document.documentElement;
    root.dataset.palette = input.palette;
    root.dataset.theme = event.data.theme === 'dark' ? 'dark' : 'light';
    const attrs = {
      homeLayout: ['layout', ['cover-right', 'cover-left', 'centered']],
      displayFont: ['font', ['literary', 'classic', 'clean']],
      coverStyle: ['coverStyle', ['angled', 'straight']],
      catalogDensity: ['density', ['airy', 'compact']],
    } as const;
    for (const key of Object.keys(attrs) as (keyof typeof attrs)[]) {
      const [attribute, choices] = attrs[key];
      if ((choices as readonly string[]).includes(input[key])) root.dataset[attribute] = input[key];
    }
    const style = document.getElementById('site-appearance');
    if (style) style.textContent = appearanceCss(input.palette, colors);
  });
}
