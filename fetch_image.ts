import https from 'https';
import fs from 'fs';

const url = 'https://storage.googleapis.com/antigravity-attachments/358b1cbb-e637-4bb0-a513-eee895f6870b/cecfbe8e-176f-4dff-bcc3-f11103ad2119';

https.get(url, (res) => {
  console.log('STATUS:', res.statusCode);
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('public/hero-model-new.png');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download Completed');
    });
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});