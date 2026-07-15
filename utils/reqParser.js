export default function reqParser(req) {
    return new Promise((resolve, reject) => {
        let chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            const rawBody = Buffer.concat(chunks).toString();
            const formData = Object.fromEntries(new URLSearchParams(rawBody));
            console.log('Parsed Form Data:', formData);
            resolve(formData);
        });
    });
}