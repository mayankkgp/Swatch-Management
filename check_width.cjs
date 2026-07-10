const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox'],
    executablePath: '/usr/bin/google-chrome'
  });
  const page = await browser.newPage();
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
    <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="h-screen w-screen flex flex-col">
      <div class="flex-1 flex items-center justify-center bg-slate-900 relative overflow-hidden" style="height: 1000px; width: 1000px;">
        <div id="test-div" class="hidden md:flex items-center justify-center h-[80%] max-h-full" style="aspect-ratio: 3/4;">
          <div style="background: linear-gradient(135deg, red, blue);" class="w-full h-full transition-transform duration-300 rounded shadow-lg"></div>
        </div>
      </div>
    </body>
    </html>
  `);
  const rect = await page.evaluate(() => {
    return document.getElementById('test-div').getBoundingClientRect();
  });
  console.log(rect);
  await browser.close();
})();
