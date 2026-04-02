const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();

const CONFIG_KEYS = {
  githubOwner: 'GITHUB_OWNER',
  githubRepo: 'GITHUB_REPO',
  githubBranch: 'GITHUB_BRANCH',
  githubFilePath: 'GITHUB_FILE_PATH',
  githubToken: 'GITHUB_TOKEN',
};

const FRIENDLY_TAB_NAMES = {
  Admin_Docs: 'Start Here',
  Purchase: 'Availability & Notes',
  Direct_Sale_Formats: 'Direct Sales',
  Retailer_Links: 'Store Links',
  Reference_Lists: 'Reference Lists',
};

const EDITOR_TABS = [
  'Start Here',
  'Series',
  'Books',
  'Availability & Notes',
  'Direct Sales',
  'Store Links',
];

const ADVANCED_TABS = ['Summary', 'Reference Lists'];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Jaclyn Site')
    .addItem('Open publishing panel', 'showJaclynSidebar')
    .addSeparator()
    .addItem('Set up easy editing view', 'showEditorTabs')
    .addItem('Show all tabs and columns', 'showAllTabs')
    .addSeparator()
    .addItem('Publish website now', 'publishSiteFromMenu')
    .addToUi();
}

function showJaclynSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Jaclyn Site Publisher')
    .setWidth(360);
  SpreadsheetApp.getUi().showSidebar(html);
}

function publishSiteFromMenu() {
  const result = publishSite();
  SpreadsheetApp.getUi().alert(result.message);
}

function publishSite() {
  const config = getConfig_();
  const blob = exportCurrentSpreadsheetAsXlsx_();
  const response = uploadWorkbookToGitHub_(blob, config);

  return {
    ok: true,
    message:
      'Website publish started. GitHub received the updated workbook and the site workflow should run in a minute or two.',
    commitUrl: response.commit ? response.commit.html_url : '',
  };
}

function showEditorTabs() {
  const spreadsheet = SpreadsheetApp.getActive();
  renameTabsForJaclyn_(spreadsheet);

  spreadsheet.getSheets().forEach((sheet) => {
    const name = sheet.getName();
    if (ADVANCED_TABS.includes(name)) {
      sheet.hideSheet();
    } else if (EDITOR_TABS.includes(name)) {
      sheet.showSheet();
    }
  });

  applyEditingLayout_();
  return { ok: true };
}

function showAllTabs() {
  const spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getSheets().forEach((sheet) => sheet.showSheet());

  const books = findSheet_(['Books']);
  const directSales = findSheet_(['Direct Sales', 'Direct_Sale_Formats']);
  if (books) {
    books.showColumns(17, 5);
  }
  if (directSales) {
    directSales.showColumns(15, 7);
  }
  return { ok: true };
}

function goToSheet(sheetName) {
  const sheet = findSheet_([sheetName]);
  if (!sheet) {
    throw new Error(`Could not find sheet: ${sheetName}`);
  }
  SpreadsheetApp.getActive().setActiveSheet(sheet);
  return { ok: true };
}

function renameTabsForJaclyn_(spreadsheet) {
  Object.keys(FRIENDLY_TAB_NAMES).forEach((originalName) => {
    const sheet = spreadsheet.getSheetByName(originalName);
    if (sheet && !spreadsheet.getSheetByName(FRIENDLY_TAB_NAMES[originalName])) {
      sheet.setName(FRIENDLY_TAB_NAMES[originalName]);
    }
  });
}

function applyEditingLayout_() {
  const books = findSheet_(['Books']);
  const availability = findSheet_(['Availability & Notes', 'Purchase']);
  const directSales = findSheet_(['Direct Sales', 'Direct_Sale_Formats']);
  const storeLinks = findSheet_(['Store Links', 'Retailer_Links']);
  const startHere = findSheet_(['Start Here', 'Admin_Docs']);

  if (startHere) {
    startHere.setTabColor('#6f425e');
  }

  if (books) {
    styleSheet_(books);
    books.setFrozenRows(1);
    books.hideColumns(17, 5);
    setColumnWidth_(books, 'title', 220);
    setColumnWidth_(books, 'short_hook', 260);
    setColumnWidth_(books, 'description', 420);
    setCheckbox_(books, 'featured');
    setHeaderNote_(books, 'formats', 'If a book has more than one format, separate them with a vertical bar. Example: ebook | paperback | audiobook');
    setHeaderNote_(books, 'featured', 'Turn this on if you want this book to show up in featured sections on the site.');
  }

  if (availability) {
    styleSheet_(availability);
    availability.setFrozenRows(1);
    setColumnWidth_(availability, 'book_title', 220);
    setColumnWidth_(availability, 'price_note', 260);
    setDropdown_(availability, 'availability_status', ['In stock', 'Limited stock', 'Sold out', 'Preorder']);
    setCheckbox_(availability, 'signed_copy');
    setCheckbox_(availability, 'direct_from_author');
    setHeaderNote_(availability, 'availability_label', 'Optional custom label. Example: Signed paperback sold out.');
    setHeaderNote_(availability, 'merchandising_flags', 'Optional. Separate multiple choices with a vertical bar. Example: Signed copy | New release');
  }

  if (directSales) {
    styleSheet_(directSales);
    directSales.setFrozenRows(1);
    directSales.hideColumns(15, 7);
    setColumnWidth_(directSales, 'book_title', 220);
    setColumnWidth_(directSales, 'unit_amount', 110);
    setCheckbox_(directSales, 'sync_to_stripe');
    setCheckbox_(directSales, 'collect_shipping_address');
    setCheckbox_(directSales, 'allow_promotion_codes');
    setDropdown_(directSales, 'format', ['ebook', 'paperback', 'hardcover', 'audiobook']);
    setDropdown_(directSales, 'purchase_mode', ['Direct checkout', 'Embedded buy button', 'Not for sale right now']);
    setDropdown_(directSales, 'currency', ['usd']);
    setHeaderNote_(directSales, 'sync_to_stripe', 'Turn this on only when this direct-sale checkout should be live on the site.');
    setHeaderNote_(directSales, 'unit_amount', 'Type the price in cents. Example: 1999 means $19.99.');
    setHeaderNote_(directSales, 'purchase_mode', 'Most rows should use Direct checkout.');
  }

  if (storeLinks) {
    styleSheet_(storeLinks);
    storeLinks.setFrozenRows(1);
    setColumnWidth_(storeLinks, 'book_title', 220);
    setColumnWidth_(storeLinks, 'purchase_url', 320);
    setDropdown_(storeLinks, 'format', ['ebook', 'paperback', 'hardcover', 'audiobook']);
  }
}

function styleSheet_(sheet) {
  if (!sheet || sheet.getLastColumn() < 1) return;
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  header
    .setFontWeight('bold')
    .setBackground('#f4eae4')
    .setWrap(true)
    .setVerticalAlignment('middle');
}

function getHeaderIndex_(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const index = headers.indexOf(headerName);
  return index === -1 ? 0 : index + 1;
}

function setColumnWidth_(sheet, headerName, width) {
  const col = getHeaderIndex_(sheet, headerName);
  if (col) sheet.setColumnWidth(col, width);
}

function setHeaderNote_(sheet, headerName, note) {
  const col = getHeaderIndex_(sheet, headerName);
  if (col) sheet.getRange(1, col).setNote(note);
}

function setCheckbox_(sheet, headerName) {
  const col = getHeaderIndex_(sheet, headerName);
  if (!col) return;
  sheet
    .getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1)
    .insertCheckboxes();
}

function setDropdown_(sheet, headerName, values) {
  const col = getHeaderIndex_(sheet, headerName);
  if (!col) return;
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(true).build();
  sheet
    .getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1)
    .setDataValidation(rule);
}

function exportCurrentSpreadsheetAsXlsx_() {
  const spreadsheet = SpreadsheetApp.getActive();
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheet.getId()}/export?format=xlsx`;
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: `Bearer ${ScriptApp.getOAuthToken()}`,
    },
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() >= 300) {
    throw new Error(`Could not export spreadsheet as .xlsx. HTTP ${response.getResponseCode()}`);
  }

  return response.getBlob().setName('jaclyn-catalog.xlsx');
}

function uploadWorkbookToGitHub_(blob, config) {
  const apiBase = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(config.filePath).replace(/%2F/g, '/')}`;
  const existing = UrlFetchApp.fetch(`${apiBase}?ref=${encodeURIComponent(config.branch)}`, {
    method: 'get',
    headers: githubHeaders_(config.token),
    muteHttpExceptions: true,
  });

  let sha = '';
  if (existing.getResponseCode() === 200) {
    const parsed = JSON.parse(existing.getContentText());
    sha = parsed.sha || '';
  } else if (existing.getResponseCode() !== 404) {
    throw new Error(`Could not check existing GitHub workbook file. HTTP ${existing.getResponseCode()}`);
  }

  const payload = {
    message: `Publish workbook from Google Sheets (${new Date().toISOString()})`,
    content: Utilities.base64Encode(blob.getBytes()),
    branch: config.branch,
  };
  if (sha) {
    payload.sha = sha;
  }

  const response = UrlFetchApp.fetch(apiBase, {
    method: 'put',
    contentType: 'application/json',
    headers: githubHeaders_(config.token),
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() >= 300) {
    throw new Error(`Could not upload workbook to GitHub. HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
  }

  return JSON.parse(response.getContentText());
}

function githubHeaders_(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function getConfig_() {
  const owner = SCRIPT_PROPERTIES.getProperty(CONFIG_KEYS.githubOwner);
  const repo = SCRIPT_PROPERTIES.getProperty(CONFIG_KEYS.githubRepo);
  const branch = SCRIPT_PROPERTIES.getProperty(CONFIG_KEYS.githubBranch) || 'main';
  const filePath = SCRIPT_PROPERTIES.getProperty(CONFIG_KEYS.githubFilePath) || 'admin-data/jaclyn-catalog.xlsx';
  const token = SCRIPT_PROPERTIES.getProperty(CONFIG_KEYS.githubToken);

  if (!owner || !repo || !token) {
    throw new Error(
      'Missing GitHub config. Set script properties GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN first.'
    );
  }

  return { owner, repo, branch, filePath, token };
}

function findSheet_(aliases) {
  const spreadsheet = SpreadsheetApp.getActive();
  for (let i = 0; i < aliases.length; i += 1) {
    const sheet = spreadsheet.getSheetByName(aliases[i]);
    if (sheet) return sheet;
  }
  return null;
}
