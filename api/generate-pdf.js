// api/generate-pdf.js - PDF 생성 API

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzWqNe3VWw85p_Hyh559Z36HJ--raMcFTRGuerobC1UV8vROnlML63agL2JifYM2MtL/exec';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { course, date } = req.body;

    // 필수 데이터 검증
    if (!course || !date) {
      return res.status(400).json({
        ok: false,
        error: '교육명과 이수일자를 입력해주세요.'
      });
    }

    // Apps Script로 PDF 생성 요청 (GET 요청으로)
    const params = new URLSearchParams({
      action: 'pdf',
      course: course,
      date: date
    });

    const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
    
    // PDF 생성 요청은 직접 URL 반환
    return res.status(200).json({
      ok: true,
      message: 'PDF 생성이 시작되었습니다.',
      pdfUrl: url
    });
    
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    return res.status(500).json({
      ok: false,
      error: 'PDF 생성 중 오류가 발생했습니다: ' + error.message
    });
  }
}
