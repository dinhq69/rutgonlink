import client from '../lib/mongodb.js';

export default async function handler(req, res) {
  try {
    // Kết nối tới Database
    await client.connect();
    const db = client.db('rutgonlink');
    const collection = db.collection('links');

    const { slug } = req.query;

    // 1. Chuyển hướng khi người dùng truy cập link ngắn (GET /:slug)
    if (req.method === 'GET') {
      if (!slug) return res.status(400).send('Thiếu mã link!');

      const item = await collection.findOne({ slug });
      if (item && item.originalUrl) {
        return res.redirect(302, item.originalUrl);
      }
      return res.status(404).send('Link không tồn tại hoặc đã bị xóa!');
    }

    // 2. Tạo link rút gọn mới từ Frontend (POST /api/shorten)
    if (req.method === 'POST') {
      const { url, customSlug } = req.body || {};
      if (!url) return res.status(400).json({ success: false, error: 'Vui lòng nhập đường dẫn!' });

      let finalSlug = customSlug ? customSlug.trim() : '';

      if (finalSlug) {
        const exist = await collection.findOne({ slug: finalSlug });
        if (exist) {
          return res.status(400).json({ success: false, error: 'Tùy chỉnh đuôi link này đã được sử dụng!' });
        }
      } else {
        finalSlug = Math.random().toString(36).substring(2, 7);
      }

      // Lưu vào MongoDB Atlas
      await collection.insertOne({
        slug: finalSlug,
        originalUrl: url,
        createdAt: new Date()
      });

      return res.status(200).json({
        success: true,
        shortUrl: `https://go.dinhq.io.vn/${finalSlug}`
      });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Lỗi MongoDB:', error);
    return res.status(500).json({ success: false, error: 'Lỗi kết nối CSDL MongoDB!' });
  }
}
