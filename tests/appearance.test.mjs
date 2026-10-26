import test from 'node:test';
import assert from 'node:assert/strict';
import { appearanceCss, contrastRatio } from '../src/lib/appearance.ts';

test('custom color accents retain their color while text, controls and buttons stay readable',()=>{
  for(const accent of ['#ffffff','#000000','#ffed00','#ff00aa','#777777']) {
    const css=appearanceCss('olive',{customBackground:'#fff6ed',customText:'#2f192b',customAccent:accent,customDarkBackground:'#171121',customDarkText:'#efe8f6',customDarkAccent:accent});
    for(const block of [...css.matchAll(/\{([^}]+)\}/g)].slice(-2)) {
      const vars=Object.fromEntries([...block[1].matchAll(/--([\w-]+):(#\w{6})(?:;|$)/g)].map(m=>[m[1],m[2]]));
      for(const [fg,bg] of [['ink','page-bg'],['surface-copy','page-bg'],['surface-muted','page-bg'],['surface-accent','page-bg'],['button-primary-text','button-primary-bg'],['input-text','input-bg'],['newsletter-ink','newsletter-bg']]) assert(contrastRatio(vars[fg],vars[bg])>=4.5,accent+' '+fg);
      assert.equal(vars['button-primary-bg'],accent);
    }
  }
});
