// api/get-roster.js - 명단 가져오기 API

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

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    // Apps Script에서 명단 정보 가져오기
    const url = `${APPS_SCRIPT_URL}?action=getRoster`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Apps Script 응답 오류: ${response.status}`);
    }
    
    const result = await response.json();
    
    // 결과 반환
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('명단 가져오기 오류:', error);
    return res.status(500).json({
      ok: false,
      error: '명단을 가져오는 중 오류가 발생했습니다: ' + error.message
    });
  }
}
