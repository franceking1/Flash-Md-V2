import mumaker from 'mumaker';
import { generateLogo, MESSAGES } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
  {
    name: 'hacker',
    aliases: [],
    description: 'Generate a neon hacker-style logo.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'hacker', 'https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html', processingMsg);
    }
  },
  {
    name: 'dragonball',
    aliases: [],
    description: 'Generate a Dragon Ball style logo.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'dragonball', 'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html', processingMsg);
    }
  },
  {
    name: 'naruto',
    aliases: [],
    description: 'Generate a Naruto Shippuden style logo.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'naruto', 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html', processingMsg);
    }
  },
  {
    name: 'sand',
    aliases: [],
    description: 'Generate a sand-style logo.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'sand', 'https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html', processingMsg);
    }
  },
  {
    name: 'sunset',
    aliases: [],
    description: 'Generate a sunset light text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'sunset', 'https://en.ephoto360.com/create-sunset-light-text-effects-online-807.html', processingMsg);
    }
  },
  {
    name: 'chocolate',
    aliases: [],
    description: 'Generate a chocolate text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'chocolate', 'https://en.ephoto360.com/chocolate-text-effect-353.html', processingMsg);
    }
  },
  {
    name: 'mechanical',
    aliases: [],
    description: 'Generate a mechanical style text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'mechanical', 'https://en.ephoto360.com/create-your-name-in-a-mechanical-style-306.html', processingMsg);
    }
  },
  {
    name: 'rain',
    aliases: [],
    description: 'Generate a foggy rainy text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'rain', 'https://en.ephoto360.com/foggy-rainy-text-effect-75.html', processingMsg);
    }
  },
  {
    name: 'cloth',
    aliases: [],
    description: 'Generate a text on cloth effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'cloth', 'https://en.ephoto360.com/text-on-cloth-effect-62.html', processingMsg);
    }
  },
  {
    name: 'water',
    aliases: [],
    description: 'Generate a water effect text logo.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'water', 'https://en.ephoto360.com/create-water-effect-text-online-295.html', processingMsg);
    }
  },
  {
    name: '1917',
    aliases: [],
    description: 'Generate a 1917 movie-style text logo.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, '1917', 'https://en.ephoto360.com/1917-style-text-effect-523.html', processingMsg);
    }
  },
  {
    name: 'graffiti',
    aliases: [],
    description: 'Generate a cartoon-style graffiti text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'graffiti', 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html', processingMsg);
    }
  },
  {
    name: 'boom',
    aliases: [],
    description: 'Generate a comic-style boom text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'boom', 'https://en.ephoto360.com/boom-text-comic-style-text-effect-675.html', processingMsg);
    }
  },
  {
    name: 'cat',
    aliases: [],
    description: 'Generate handwritten text on foggy glass.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'cat', 'https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html', processingMsg);
    }
  },
  {
    name: 'purple',
    aliases: [],
    description: 'Generate a purple text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'purple', 'https://en.ephoto360.com/purple-text-effect-online-100.html', processingMsg);
    }
  },
  {
    name: 'gold',
    aliases: [],
    description: 'Generate a modern gold text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'gold', 'https://en.ephoto360.com/modern-gold-4-213.html', processingMsg);
    }
  },
  {
    name: 'arena',
    aliases: [],
    description: 'Generate Arena of Valor-style cover text.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'arena', 'https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html', processingMsg);
    }
  },
  {
    name: 'incandescent',
    aliases: [],
    description: 'Generate incandescent bulb text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'incandescent', 'https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html', processingMsg);
    }
  },
  {
    name: 'child',
    aliases: [],
    description: 'Write text on wet glass style.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'child', 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html', processingMsg);
    }
  },
  {
    name: 'typo',
    aliases: [],
    description: 'Generate typography text on pavement.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'typo', 'https://en.ephoto360.com/typography-text-effect-on-pavement-online-774.html', processingMsg);
    }
  },
  {
    name: 'light',
    aliases: [],
    description: 'Generate futuristic light technology style text.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'light', 'https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html', processingMsg);
    }
  },
  {
    name: 'steel',
    aliases: [],
    description: 'Generate dragon steel text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'steel', 'https://en.ephoto360.com/dragon-steel-text-effect-online-347.html', processingMsg);
    }
  },
  {
    name: 'sunlight',
    aliases: [],
    description: 'Generate a sunlight shadow text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'sunlight', 'https://en.ephoto360.com/sunlight-shadow-text-204.html', processingMsg);
    }
  },
  {
    name: 'frozen',
    aliases: [],
    description: 'Generate a frozen Christmas text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'frozen', 'https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html', processingMsg);
    }
  },
  {
    name: 'leaves',
    aliases: [],
    description: 'Generate a green brush text effect.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'leaves', 'https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html', processingMsg);
    }
  },
  {
    name: 'night',
    aliases: [],
    description: 'Generate a stars-at-night style logo.',
    category: 'Logo',
    execute: async ({ sock, from, text, msg }) => {
      const processingMsg = await t(from, 'logo', 'processing');
      await generateLogo(sock, from, text, msg, 'night', 'https://en.ephoto360.com/stars-night-online-1-85.html', processingMsg);
    }
  }
];
