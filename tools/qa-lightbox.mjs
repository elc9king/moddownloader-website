export default async function run(page, ui) {
  // Click the gallery screenshot button to open the lightbox
  const btn = await page.$('[data-shot]');
  if (!btn) return { error: 'no gallery button' };
  await btn.click();
  await page.waitForTimeout(400);
  const open = await page.evaluate(() => document.querySelector('.lightbox').classList.contains('open'));
  // Press Escape to close
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const closed = await page.evaluate(() => !document.querySelector('.lightbox').classList.contains('open'));
  return { lightboxOpened: open, escapeCloses: closed };
}
