export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { url, customSlug } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập URL!' });
  }

  // Sinh slug ngẫu nhiên nếu không truyền customSlug
  const slug = customSlug && customSlug.trim() !== '' 
    ? customSlug.trim() 
    : Math.random().toString(36).substring(2, 7);

  // Lưu ý: Đây là ví dụ trả về link. Cần kết nối KV Store/Database nếu muốn lưu lại
  const BASE_DOMAIN = 'https://go.dinhq.io.vn';
  
  return res.status(200).json({
    success: true,
    shortUrl: `${BASE_DOMAIN}/${slug}`
  });
}
