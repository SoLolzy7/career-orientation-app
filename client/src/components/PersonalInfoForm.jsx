import { useState } from 'react';
import { motion } from 'framer-motion';

function PersonalInfoForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onSubmit({ name, email });
    } else {
      alert('Vui lòng điền đầy đủ thông tin');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container"
    >
      <div className="card">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🌟 Khám Phá Định Hướng Nghề Nghiệp
        </h1>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
          Bài test MBTI giúp bạn hiểu rõ tính cách và tìm ra nghề nghiệp phù hợp
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ tên của bạn"
              required
            />
          </div>
          
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
            <small style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>
              Kết quả sẽ được gửi đến email của bạn
            </small>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Bắt đầu làm bài test 🚀
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default PersonalInfoForm;