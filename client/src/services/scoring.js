// Hàm tính điểm MBTI dựa trên thang điểm 1-5
// Điểm chuẩn cho mỗi nhóm là 15 (5 câu hỏi x 3 điểm trung bình)
// Điểm > 15 nghiêng về trait đầu, điểm ≤ 15 nghiêng về trait sau

export function calculatePersonality(answers, questions) {
  // Khởi tạo điểm số cho từng nhóm
  const groupScores = {
    EI: 0,  // Extroversion vs Introversion
    SN: 0,  // Intuition vs Sensing
    TF: 0,  // Feeling vs Thinking
    JP: 0   // Perceiving vs Judging
  };
  
  // Đếm số câu hỏi mỗi nhóm
  const groupCounts = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };
  
  // Tính tổng điểm cho từng nhóm
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const group = question.group;
      const score = answer.value; // Giá trị từ 1-5
      
      groupScores[group] += score;
      groupCounts[group]++;
    }
  });
  
  // Tính điểm trung bình và xác định trait
  // Điểm chuẩn: 3 điểm/câu, tổng 5 câu = 15 điểm
  // Điểm > 15: nghiêng về trait hướng ngoại (E, N, F, P)
  // Điểm ≤ 15: nghiêng về trait hướng nội (I, S, T, J)
  
  const energy = groupScores.EI > 15 ? 'E' : 'I';        // EI: E > 15, I ≤ 15
  const perception = groupScores.SN > 15 ? 'N' : 'S';    // SN: N > 15, S ≤ 15
  const decision = groupScores.TF > 15 ? 'F' : 'T';      // TF: F > 15, T ≤ 15
  const lifestyle = groupScores.JP > 15 ? 'P' : 'J';     // JP: P > 15, J ≤ 15
  
  const type = energy + perception + decision + lifestyle;
  
  // Tính tỷ lệ phần trăm cho từng cặp (dựa trên độ lệch so với điểm chuẩn)
  const calculatePercentage = (score, maxScore = 25) => {
    // Điểm tối đa mỗi nhóm: 5 câu x 5 điểm = 25
    // Điểm tối thiểu: 5 câu x 1 điểm = 5
    // Điểm chuẩn: 15
    // Tính phần trăm độ mạnh của trait chiếm ưu thế
    const deviation = Math.abs(score - 15);
    const maxDeviation = 10; // 25 - 15 = 10
    const percentage = Math.round((deviation / maxDeviation) * 100);
    return Math.min(percentage, 100);
  };
  
  const percentages = {
    EI: {
      E: groupScores.EI,
      I: groupScores.EI,
      dominant: energy,
      percentage: calculatePercentage(groupScores.EI),
      score: groupScores.EI
    },
    SN: {
      S: groupScores.SN,
      N: groupScores.SN,
      dominant: perception,
      percentage: calculatePercentage(groupScores.SN),
      score: groupScores.SN
    },
    TF: {
      T: groupScores.TF,
      F: groupScores.TF,
      dominant: decision,
      percentage: calculatePercentage(groupScores.TF),
      score: groupScores.TF
    },
    JP: {
      J: groupScores.JP,
      P: groupScores.JP,
      dominant: lifestyle,
      percentage: calculatePercentage(groupScores.JP),
      score: groupScores.JP
    }
  };
  
  return { 
    type, 
    scores: groupScores, 
    percentages,
    rawScores: groupScores,
    groupCounts
  };
}

// Lấy mô tả chi tiết cho từng trait
export function getTraitDescription(trait) {
  const descriptions = {
    'E': { 
      name: 'Hướng ngoại (Extroversion)', 
      description: 'Tràn đầy năng lượng khi ở bên người khác, thích giao tiếp và hoạt động nhóm',
      characteristics: ['Năng động', 'Thích giao tiếp', 'Làm việc nhóm tốt']
    },
    'I': { 
      name: 'Hướng nội (Introversion)', 
      description: 'Năng lượng đến từ thời gian ở một mình, thích suy nghĩ sâu và làm việc độc lập',
      characteristics: ['Sâu sắc', 'Tập trung', 'Làm việc độc lập']
    },
    'S': { 
      name: 'Giác quan (Sensing)', 
      description: 'Chú ý đến chi tiết, thực tế, dựa vào kinh nghiệm và dữ liệu cụ thể',
      characteristics: ['Thực tế', 'Tỉ mỉ', 'Chú ý chi tiết']
    },
    'N': { 
      name: 'Trực giác (Intuition)', 
      description: 'Nhìn tổng thể, hướng về tương lai, thích khám phá ý tưởng mới',
      characteristics: ['Sáng tạo', 'Tầm nhìn', 'Thích đổi mới']
    },
    'T': { 
      name: 'Lý trí (Thinking)', 
      description: 'Quyết định dựa trên logic, phân tích và sự thật khách quan',
      characteristics: ['Logic', 'Phân tích', 'Công bằng']
    },
    'F': { 
      name: 'Cảm xúc (Feeling)', 
      description: 'Quyết định dựa trên giá trị cá nhân, cảm xúc và sự hài hòa',
      characteristics: ['Đồng cảm', 'Quan tâm', 'Hài hòa']
    },
    'J': { 
      name: 'Nguyên tắc (Judging)', 
      description: 'Thích cấu trúc, kế hoạch rõ ràng, quyết định sớm',
      characteristics: ['Có tổ chức', 'Đúng hẹn', 'Thích kế hoạch']
    },
    'P': { 
      name: 'Linh hoạt (Perceiving)', 
      description: 'Thích tự do, thích ứng với thay đổi, giữ nhiều lựa chọn',
      characteristics: ['Linh hoạt', 'Tự phát', 'Thích nghi tốt']
    }
  };
  return descriptions[trait];
}

// Hàm xác định loại tính cách chi tiết dựa trên decision tree
export function getPersonalityDetails(type, careersData) {
  const careerInfo = careersData[type] || {
    description: 'Tính cách độc đáo của bạn',
    careers: []
  };
  
  // Phân tích nhóm tính cách dựa trên decision tree
  const analysis = {
    INTJ: {
      core: 'Nhà chiến lược - Tầm nhìn xa, độc lập, giải quyết vấn đề phức tạp',
      strengths: ['Tư duy chiến lược', 'Độc lập', 'Kiên định']
    },
    INTP: {
      core: 'Nhà tư duy - Phân tích logic, tò mò, thích khám phá',
      strengths: ['Logic', 'Phân tích', 'Sáng tạo']
    },
    ENTJ: {
      core: 'Nhà lãnh đạo - Quyết đoán, chiến lược, tổ chức',
      strengths: ['Lãnh đạo', 'Chiến lược', 'Quyết đoán']
    },
    ENTP: {
      core: 'Nhà phát minh - Thông minh, thích tranh luận, đổi mới',
      strengths: ['Sáng tạo', 'Linh hoạt', 'Đàm phán']
    },
    INFJ: {
      core: 'Người cố vấn - Sâu sắc, có tầm nhìn, nhân văn',
      strengths: ['Thấu hiểu', 'Tầm nhìn', 'Kiên nhẫn']
    },
    INFP: {
      core: 'Người lý tưởng - Sáng tạo, chân thành, giàu cảm xúc',
      strengths: ['Sáng tạo', 'Chân thành', 'Đồng cảm']
    },
    ENFJ: {
      core: 'Người truyền cảm hứng - Nhiệt huyết, kết nối, lãnh đạo',
      strengths: ['Giao tiếp', 'Lãnh đạo', 'Thấu hiểu']
    },
    ENFP: {
      core: 'Người khám phá - Sáng tạo, năng động, yêu thích kết nối',
      strengths: ['Sáng tạo', 'Nhiệt huyết', 'Linh hoạt']
    },
    ISTJ: {
      core: 'Người thực tế - Đáng tin cậy, có trách nhiệm, hệ thống',
      strengths: ['Trách nhiệm', 'Chi tiết', 'Đáng tin cậy']
    },
    ISFJ: {
      core: 'Người bảo vệ - Tận tụy, chu đáo, quan tâm người khác',
      strengths: ['Chu đáo', 'Tận tâm', 'Kiên nhẫn']
    },
    ESTJ: {
      core: 'Người quản lý - Thực tế, hiệu quả, lãnh đạo',
      strengths: ['Tổ chức', 'Quyết đoán', 'Hiệu quả']
    },
    ESFJ: {
      core: 'Người chăm sóc - Ấm áp, quan tâm, xây dựng cộng đồng',
      strengths: ['Quan tâm', 'Hòa đồng', 'Trách nhiệm']
    },
    ISTP: {
      core: 'Người thực hành - Khéo léo, thực tế, giải quyết vấn đề',
      strengths: ['Khéo léo', 'Thực tế', 'Giải quyết vấn đề']
    },
    ISFP: {
      core: 'Người nghệ sĩ - Nhạy cảm, sáng tạo, yêu thích cái đẹp',
      strengths: ['Sáng tạo', 'Nhạy cảm', 'Chân thành']
    },
    ESTP: {
      core: 'Người hành động - Năng động, thích mạo hiểm, thực tế',
      strengths: ['Năng động', 'Thực tế', 'Quyết đoán']
    },
    ESFP: {
      core: 'Người giải trí - Vui vẻ, nhiệt tình, thích làm trung tâm',
      strengths: ['Vui vẻ', 'Nhiệt tình', 'Linh hoạt']
    }
  };
  
  return {
    ...careerInfo,
    coreDescription: analysis[type]?.core || 'Tính cách độc đáo của bạn',
    strengths: analysis[type]?.strengths || ['Sáng tạo', 'Linh hoạt', 'Kiên trì']
  };
}