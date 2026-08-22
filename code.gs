/**
 * ICAH PRINT - BACKEND KASIR (Google Apps Script)
 * ---------------------------------------------------------------
 * Cara pasang: lihat file PANDUAN-SETUP.md
 * File ini HARUS ditempel di Extensions > Apps Script pada
 * Google Spreadsheet yang akan dipakai sebagai database.
 * ---------------------------------------------------------------
 */

var PRODUCT_SHEET = 'Produk';
var TRANSACTION_SHEET = 'Transaksi';
var DETAIL_SHEET = 'DetailTransaksi';

function doGet(e) {
  try {
    var action = e.parameter.action;
    if (action === 'getProducts') return respond({ success: true, data: getProducts() });
    if (action === 'getTransactions') return respond({ success: true, data: getTransactions() });
    if (action === 'ping') return respond({ success: true, message: 'Terhubung ke ' + SpreadsheetApp.getActiveSpreadsheet().getName() });
    return respond({ success: false, error: 'Aksi GET tidak dikenal: ' + action });
  } catch (err) {
    return respond({ success: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var data = body.data;

    if (action === 'addProduct') return respond(addProduct(data));
    if (action === 'updateProduct') return respond(updateProduct(data));
    if (action === 'deleteProduct') return respond(deleteProduct(data.kode));
    if (action === 'saveTransaction') return respond(saveTransaction(data));

    return respond({ success: false, error: 'Aksi POST tidak dikenal: ' + action });
  } catch (err) {
    return respond({ success: false, error: String(err) });
  }
}

/* ---------------- helper sheet ---------------- */

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === PRODUCT_SHEET) {
      sheet.appendRow(['Kode', 'Nama Barang', 'Kategori', 'Harga', 'Satuan']);
    } else if (name === TRANSACTION_SHEET) {
      sheet.appendRow(['No Invoice', 'Tanggal', 'Kasir', 'Metode Bayar', 'Total', 'Bayar', 'Kembalian']);
    } else if (name === DETAIL_SHEET) {
      sheet.appendRow(['No Invoice', 'Kode', 'Nama Barang', 'Qty', 'Harga', 'Subtotal']);
    }
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  }
  return sheet;
}

/* ---------------- produk ---------------- */

function getProducts() {
  var sheet = getSheet(PRODUCT_SHEET);
  var values = sheet.getDataRange().getValues();
  var rows = values.slice(1);
  return rows
    .filter(function (r) { return r[0] !== '' && r[0] !== null; })
    .map(function (r) {
      return { kode: String(r[0]), nama: r[1], kategori: r[2], harga: Number(r[3]) || 0, satuan: r[4] };
    });
}

function addProduct(p) {
  var sheet = getSheet(PRODUCT_SHEET);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(p.kode)) {
      return { success: false, error: 'Kode barang "' + p.kode + '" sudah ada' };
    }
  }
  sheet.appendRow([p.kode, p.nama, p.kategori, p.harga, p.satuan]);
  return { success: true };
}

function updateProduct(p) {
  var sheet = getSheet(PRODUCT_SHEET);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(p.kode)) {
      sheet.getRange(i + 1, 1, 1, 5).setValues([[p.kode, p.nama, p.kategori, p.harga, p.satuan]]);
      return { success: true };
    }
  }
  return { success: false, error: 'Produk tidak ditemukan' };
}

function deleteProduct(kode) {
  var sheet = getSheet(PRODUCT_SHEET);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(kode)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'Produk tidak ditemukan' };
}

/* ---------------- transaksi / invoice ---------------- */

function saveTransaction(t) {
  var sheet = getSheet(TRANSACTION_SHEET);
  var detailSheet = getSheet(DETAIL_SHEET);

  sheet.appendRow([t.invoiceNo, t.tanggal, t.kasir, t.metode, t.total, t.bayar, t.kembalian]);

  t.items.forEach(function (item) {
    detailSheet.appendRow([t.invoiceNo, item.kode, item.nama, item.qty, item.harga, item.subtotal]);
  });

  return { success: true, invoiceNo: t.invoiceNo };
}

function getTransactions() {
  var sheet = getSheet(TRANSACTION_SHEET);
  var values = sheet.getDataRange().getValues();
  var rows = values.slice(1).reverse().slice(0, 100);
  return rows.map(function (r) {
    return { invoiceNo: r[0], tanggal: r[1], kasir: r[2], metode: r[3], total: r[4], bayar: r[5], kembalian: r[6] };
  });
}

/* ---------------- util ---------------- */

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}