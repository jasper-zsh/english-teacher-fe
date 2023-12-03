const OSS = require('ali-oss');
const fs = require('node:fs/promises');
const path = require('node:path');

const options = {
    region: process.env.ALI_OSS_REGION,
    accessKeyId: process.env.ALI_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET,
    bucket: process.env.ALI_OSS_BUCKET,
}

const client = new OSS(options);

(async () => {
    const files = await fs.readdir('./dist', {
        recursive: true,
    })
    for (const file of files) {
        const filepath = path.join('./dist', file);
        const stat = await fs.lstat(filepath);
        if (!stat.isFile()) {
            continue
        }
        await client.put(file, filepath)
        console.log('uploaded', file)
    }
})()