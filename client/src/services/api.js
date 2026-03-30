import emailjs from '@emailjs/browser';

// ============================================
// THÔNG TIN EMAILJS CỦA BẠN
// ============================================
const PUBLIC_KEY = '_XHBDRtVZ2kIeB1ig';
const SERVICE_ID = 'service_r27rtd7';
const TEMPLATE_ID = 'template_8flr1rt';

export async function sendResultEmail(to, name, personality, careers) {
  console.log('========== BẮT ĐẦU GỬI EMAIL ==========');
  console.log('📧 Email người nhận:', to);
  console.log('👤 Tên:', name);
  console.log('🧠 Tính cách:', personality);
  console.log('💼 Danh sách nghề:', careers);
  console.log('========================================');
  
  // Kiểm tra email có bị rỗng không
  if (!to || to.trim() === '') {
    console.error('❌ LỖI: Email người nhận bị rỗng!');
    throw new Error('Email người nhận không hợp lệ');
  }
  
  try {
    // Tạo danh sách careers với định dạng HTML
    const careersHtml = careers.map(career => `
      <div style="padding: 12px; margin: 8px 0; background: #f9fafb; border-radius: 8px; border-left: 4px solid #667eea;">
        <strong>✨ ${career}</strong>
      </div>
    `).join('');
    
    // Tạo danh sách careers dạng text (phòng trường hợp)
    const careersText = careers.map(career => `- ${career}`).join('\n');
    
    // Chuẩn bị dữ liệu gửi đi
    const templateParams = {
      email: to,                      
      user_name: name,
      personality_type: personality,
      careers_list: careersHtml,
    };
    
    console.log('📤 Template Params:', templateParams);
    console.log('🆔 Service ID:', SERVICE_ID);
    console.log('📄 Template ID:', TEMPLATE_ID);
    console.log('🔑 Public Key:', PUBLIC_KEY);
    
    // Gửi email qua EmailJS
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    
    console.log('✅ Email sent successfully!', response);
    return response;
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('❌ Error status:', error.status);
    console.error('❌ Error text:', error.text);
    console.error('❌ Error message:', error.message);
    
    // Hiển thị lỗi chi tiết
    if (error.text === 'The recipients address is empty') {
      throw new Error('Email người nhận bị trống. Vui lòng kiểm tra lại!');
    }
    
    throw new Error(`Gửi email thất bại: ${error.text || error.message}`);
  }
}