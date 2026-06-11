/**
 * 신앙인사이드 결과 수집용 Google Apps Script
 * - 검사 결과를 현재 구글 시트에 한 줄씩 누적 저장합니다.
 * - 웹앱으로 배포한 뒤, 배포 URL을 신앙인사이드 어드민(⚙️) > "결과 수집 서버" 칸에 붙여넣으세요.
 *
 * 설치 방법은 README.md 파일을 참고하세요.
 */

var SHEET_NAME = 'results';

// ── 결과 수신(저장) ──
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var data = JSON.parse(e.postData.contents);
    var answers = data.answers || [];

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // 첫 줄이면 헤더 작성
    if (sheet.getLastRow() === 0) {
      var header = ['ID', '날짜', '이름', '성별', '나이'];
      answers.forEach(function (a) { header.push((a.rightLabel || '') + ' 점수'); });
      header.push('상세(JSON)');
      sheet.appendRow(header);
    }

    var row = [
      data.id || '',
      new Date(),
      data.name || '',
      data.gender || '',
      data.age || ''
    ];
    answers.forEach(function (a) { row.push(a.right); });
    row.push(JSON.stringify(answers));
    sheet.appendRow(row);

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// ── 결과 목록 조회 (JSONP 지원) ──
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  var results = [];

  if (sheet && sheet.getLastRow() > 1) {
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      var v = values[i];
      var detail = v[v.length - 1];
      var answers = [];
      try { answers = detail ? JSON.parse(detail) : []; } catch (e3) {}
      results.push({
        id: v[0],
        date: v[1],
        name: v[2],
        gender: v[3],
        age: v[4],
        answers: answers
      });
    }
  }

  var payload = JSON.stringify({ ok: true, results: results });
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) {
    return ContentService
      .createTextOutput(cb + '(' + payload + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
