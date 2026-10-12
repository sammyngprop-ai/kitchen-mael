// Google Apps Script backend: paste into script.google.com (Extensions > Apps Script from your Sheet).
const SHEET_NAME = 'Meals';
const FOLDER_NAME = 'KitchenMael Photos';
const HEADERS = ['Logged At', 'Date', 'Person', 'Meal', 'Description', 'Photo Link', 'Photo'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#f3e8d8');
    sh.setFrozenRows(1);
    sh.setColumnWidth(5, 260);
    sh.setColumnWidth(7, 140);
  }
  return sh;
}

function getFolder_() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d.person || !d.meal || !d.date) throw new Error('Missing person, meal or date');

    let link = '', imgFormula = '';
    if (d.photo) {
      const bytes = Utilities.base64Decode(d.photo);
      const blob = Utilities.newBlob(bytes, d.mime || 'image/jpeg',
        [d.date, d.person, d.meal].join('_') + '.jpg');
      const file = getFolder_().createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      link = file.getUrl();
      imgFormula = '=IMAGE("https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w400")';
    }

    const sh = getSheet_();
    sh.appendRow([new Date(), d.date, d.person, d.meal, d.description || '', link, imgFormula]);
    if (imgFormula) sh.setRowHeight(sh.getLastRow(), 110);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Returns the latest 30 entries for the app's "Recent" list.
function doGet() {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return json_({ ok: true, rows: [] });
  const start = Math.max(2, last - 29);
  const vals = sh.getRange(start, 1, last - start + 1, 6).getDisplayValues();
  const rows = vals.reverse().map(r => ({
    date: r[1], person: r[2], meal: r[3], description: r[4], link: r[5]
  }));
  return json_({ ok: true, rows: rows });
}
