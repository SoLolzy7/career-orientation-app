import emailjs from '@emailjs/browser';

// ============================================
// CẤU HÌNH EMAILJS - THAY BẰNG THÔNG TIN THẬT CỦA BẠN
// ============================================
// Đăng ký tại: https://www.emailjs.com/
// 1. PUBLIC_KEY: Vào "Account" → "API Keys" → Copy Public Key
// 2. SERVICE_ID: Vào "Email Services" → Tạo service Gmail → Copy Service ID
// 3. TEMPLATE_ID: Vào "Email Templates" → Tạo template → Copy Template ID
// ============================================

const PUBLIC_KEY = '_XHBDRtVZ2kIeB1ig';     // Thay bằng Public Key của bạn
const SERVICE_ID = 'service_r27rtd7';     // Thay bằng Service ID của bạn
const TEMPLATE_ID = 'template_8flr1rt';   // Thay bằng Template ID của bạn

export async function sendResultEmail(to, name, personality, careers) {
  try {
    // Tạo danh sách careers với định dạng HTML
    const careersHtml = careers.map(career => `
      <div style="padding: 12px; margin: 8px 0; background: #f9fafb; border-radius: 8px; border-left: 4px solid #667eea;">
        <strong>• ${career}</strong>
      </div>
    `).join('');

    // Chuẩn bị dữ liệu gửi đi
    const templateParams = {
      to_email: to,
      user_name: name,
      personality_type: personality,
      careers_list: careersHtml,
      reply_to: 'hoangtri@example.com', // Thay bằng email của bạn
    };

    // Gửi email qua EmailJS
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Email sent successfully!', response);
    return response;
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Không thể gửi email. Vui lòng thử lại!');
  }
}