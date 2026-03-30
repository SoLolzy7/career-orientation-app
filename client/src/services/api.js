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
  
  // Kiểm tra email
  if (!to || to.trim() === '') {
    console.error('❌ LỖI: Email người nhận bị rỗng!');
    throw new Error('Email người nhận không hợp lệ');
  }
  
  try {
    // Tạo danh sách careers với định dạng HTML đẹp (song ngữ)
    const careersHtml = careers.map((career, index) => {
      // Nếu career là object có title và titleEn
      if (typeof career === 'object' && career.title) {
        return `
          <div class="career-card" style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 12px 0; border-left: 4px solid #667eea;">
            <div class="career-title" style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 5px;">
              ✨ ${index + 1}. ${career.title}
            </div>
            <div class="career-title-en" style="font-size: 14px; color: #667eea; margin-bottom: 8px;">
              📍 ${career.titleEn || career.title}
            </div>
            <div class="career-reason" style="font-size: 14px; color: #6b7280; margin-top: 8px;">
              💡 ${career.reason || 'Phù hợp với tính cách của bạn'}
            </div>
          </div>
        `;
      }
      // Nếu career là string
      return `
        <div class="career-card" style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 12px 0; border-left: 4px solid #667eea;">
          <div class="career-title" style="font-size: 18px; font-weight: bold; color: #333;">
            ✨ ${index + 1}. ${career}
          </div>
        </div>
      `;
    }).join('');
    
    // Chuẩn bị dữ liệu gửi đi
    const templateParams = {
      email: to,                      // Khớp với {{email}} trong template
      user_name: name,                // Khớp với {{user_name}}
      personality_type: personality,  // Khớp với {{personality_type}}
      careers_list: careersHtml,      // Khớp với {{careers_list}}
    };
    
    console.log('📤 Template Params gửi đi:', templateParams);
    
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
    console.error('❌ Error text:', error.text);
    console.error('❌ Error message:', error.message);
    
    if (error.text === 'The recipients address is empty') {
      throw new Error('Email người nhận bị trống. Vui lòng kiểm tra lại!');
    }
    
    throw new Error(`Gửi email thất bại: ${error.text || error.message}`);
  }
}