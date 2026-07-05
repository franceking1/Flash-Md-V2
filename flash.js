import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing sharp module...');

try {
    const nodeVersion = process.version;
    console.log(`Node version: ${nodeVersion}`);
    
    const sharpPaths = [
        'node_modules/sharp',
        'node_modules/wa-sticker-formatter/node_modules/sharp'
    ];
    
    for (const sharpPath of sharpPaths) {
        const fullPath = path.join(__dirname, sharpPath);
        if (fs.existsSync(fullPath)) {
            fs.rmSync(fullPath, { recursive: true, force: true });
        }
    }
    
    execSync('npm rebuild sharp --force', { stdio: 'inherit' });
    
    await import('sharp');
    console.log('✅ Sharp module fixed successfully!');
    
} catch (error) {
    console.error('❌ Sharp fix failed:', error.message);
    process.exit(1);
}
