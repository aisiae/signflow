// api/save-roster.js - 명단 저장 API

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
    const { course, date, memo, names } = req.body;

    // 필수 데이터 검증
    if (!course || !date || !names) {
      return res.status(400).json({
        ok: false,
        error: '필수 정보가 누락되었습니다.'
      });
    }

    // Apps Script로 데이터 전송 (GET 요청으로)
    const params = new URLSearchParams({
      action: 'saveRoster',
      course: course,
      date: date,
      memo: memo || '',
      names: names
    });

    const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Apps Script 응답 오류: ${response.status}`);
    }
    
    const result = await response.json();
    
    // 결과 반환
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('명단 저장 오류:', error);
    return res.status(500).json({
      ok: false,
      error: '명단 저장 중 오류가 발생했습니다: ' + error.message
    });
  }
}
