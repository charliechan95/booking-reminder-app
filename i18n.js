/* i18n — EN / 繁中 language switch for the WhatsApp booking + reminders app.
   UI language only; user data is never translated. Persisted per browser. */
"use strict";

const I18N = {
  zh: {
    title: "📅 預約 + 提醒",

    app_title: "📅 預約 + 提醒",
    tab_dashboard: "儀表板", tab_bookings: "預約", tab_services: "服務",
    tab_hours: "營業時間", tab_settings: "設定",
    today_bookings: "今日已確認預約", noshow_rate_7d: "近7日爽約率",
    pending_deposits: "待收訂金", total_bookings: "預約總數",
    today_list: "今日預約", view_all: "查看全部 →",
    new_booking: "+ 新增預約", search_ph: "搜尋姓名 / 電話…",
    all_status: "全部狀態", apply: "篩選", reset: "重設",
    f_name: "客人姓名", f_phone: "電話", f_service: "服務",
    f_date: "日期", f_slot: "時段", f_notes: "備註",
    save: "儲存", cancel: "取消", edit_booking: "編輯預約",
    pick_service_date: "— 先選服務及日期 —", no_slots: "— 該日沒有空位 —",
    col_customer: "客人", col_service: "服務", col_datetime: "日期時間",
    col_status: "狀態", col_deposit: "訂金", col_actions: "操作",
    wa_confirm: "📩 確認", wa_remind: "⏰ 提醒", wa_deposit: "💰 催訂金",
    st_arrived: "✓ 到達", st_noshow: "✗ 爽約", st_cancel: "取消",
    st_edit: "✎ 編輯", st_del: "刪除",
    dep_paid: "✓ 訂金已付", dep_waive: "豁免訂金",
    no_results: "沒有符合的預約。", no_phone: "（未填電話，無法WhatsApp）",
    svc_name_zh: "服務名稱（中文）", svc_name_en: "服務名稱（英文）",
    svc_duration: "需時（分鐘）", svc_price: "價錢（HKD）",
    svc_add: "新增服務", svc_list: "服務列表",
    svc_update: "更新服務",
    backup_title: "備份",
    backup_hint: "將所有服務、預約、設定和 WhatsApp 範本下載為備份檔案；也可從備份檔案還原。還原前會先驗證檔案內容，驗證失敗不會改動任何資料。",
    backup_export: "匯出備份", backup_import: "匯入還原",
    backup_ok: "備份已還原 ✓",
    backup_bad: "備份檔案無效，未作任何改動。",
    err_storage: "儲存失敗：瀏覽器儲存空間已滿或被封鎖，資料未被儲存。",
    hours_hint: "勾選營業的日子，設定開門及關門時間。時段會按服務所需時間自動生成。",
    hours_save: "儲存營業時間",
    set_shop: "店名", set_shop_phone: "店舖 WhatsApp 號碼",
    set_fps_id: "FPS ID", set_fps_name: "FPS 戶口名稱",
    set_payme: "PayMe 名稱", set_dep_mode: "訂金模式",
    dep_flat: "固定金額", dep_percent: "服務價錢百分比",
    set_dep_value: "訂金金額 / 百分比", set_lang: "語言",
    set_save: "儲存設定", set_saved: "設定已儲存 ✓",
    tpl_title: "WhatsApp 訊息範本",
    tpl_confirm: "確認預約訊息", tpl_remind: "預約提醒訊息",
    tpl_deposit: "訂金訊息",
    tpl_hint: "可填入：{name} 客人姓名 · {shop} 店名 · {service} 服務 · {date} 日期 · {time} 時間 · {amount} 訂金金額 · {fps_id} · {fps_name}。如不修改，會使用內置範本，並自動跟隨語言切換。",
    pct_hint: "%（如 50 = 價錢一半）",
    err_name: "請填寫客人姓名。", err_date: "請選擇日期。",
    err_time: "請選擇時段。", err_service: "請選擇服務。",
    err_slot: "該時段已被預約，請選另一時段。",
    err_svc_in_use: "此服務已有預約使用，不能刪除。",
    confirm_del: "確定刪除此預約？", confirm_del_svc: "確定刪除此服務？",
    hours_open: "開門",
    hours_close: "關門",
  },
  en: {
    title: "📅 Booking + Reminders",

    app_title: "📅 Booking + Reminders",
    tab_dashboard: "Dashboard", tab_bookings: "Bookings", tab_services: "Services",
    tab_hours: "Hours", tab_settings: "Settings",
    today_bookings: "Today's confirmed bookings", noshow_rate_7d: "7-day no-show rate",
    pending_deposits: "Pending deposits", total_bookings: "Total bookings",
    today_list: "Today's bookings", view_all: "View all →",
    new_booking: "+ New booking", search_ph: "Search name / phone…",
    all_status: "All statuses", apply: "Filter", reset: "Reset",
    f_name: "Customer name", f_phone: "Phone", f_service: "Service",
    f_date: "Date", f_slot: "Time slot", f_notes: "Notes",
    save: "Save", cancel: "Cancel", edit_booking: "Edit booking",
    pick_service_date: "— pick service and date first —", no_slots: "— no slots that day —",
    col_customer: "Customer", col_service: "Service", col_datetime: "Date & time",
    col_status: "Status", col_deposit: "Deposit", col_actions: "Actions",
    wa_confirm: "📩 Confirm", wa_remind: "⏰ Remind", wa_deposit: "💰 Deposit",
    st_arrived: "✓ Arrived", st_noshow: "✗ No-show", st_cancel: "Cancel",
    st_edit: "✎ Edit", st_del: "Delete",
    dep_paid: "✓ Deposit paid", dep_waive: "Waive deposit",
    no_results: "No matching bookings.", no_phone: "(no phone — WhatsApp unavailable)",
    svc_name_zh: "Service name (Chinese)", svc_name_en: "Service name (English)",
    svc_duration: "Duration (min)", svc_price: "Price (HKD)",
    svc_add: "Add service", svc_list: "Service list",
    svc_update: "Update service",
    backup_title: "Backup",
    backup_hint: "Download a backup file with all services, bookings, settings and WhatsApp templates — or restore from one. The file is validated before anything is written; an invalid file changes nothing.",
    backup_export: "Export backup", backup_import: "Import & restore",
    backup_ok: "Backup restored ✓",
    backup_bad: "Invalid backup file — nothing was changed.",
    err_storage: "Save failed: browser storage is full or blocked — your data was NOT saved.",
    hours_hint: "Tick the days you open and set opening/closing times. Slots are generated from the service duration.",
    hours_save: "Save hours",
    set_shop: "Shop name", set_shop_phone: "Shop WhatsApp number",
    set_fps_id: "FPS ID", set_fps_name: "FPS account name",
    set_payme: "PayMe name", set_dep_mode: "Deposit mode",
    dep_flat: "Flat amount", dep_percent: "% of service price",
    set_dep_value: "Deposit amount / %", set_lang: "Language",
    set_save: "Save settings", set_saved: "Settings saved ✓",
    tpl_title: "WhatsApp message templates",
    tpl_confirm: "Booking confirmation", tpl_remind: "Appointment reminder",
    tpl_deposit: "Deposit request",
    tpl_hint: "You can use: {name} customer · {shop} shop name · {service} service · {date} date · {time} time · {amount} deposit amount · {fps_id} · {fps_name}. Leave a box as it is to keep the built-in template, which switches with the app language automatically.",
    pct_hint: "% (e.g. 50 = half the price)",
    err_name: "Please enter the customer name.", err_date: "Please pick a date.",
    err_time: "Please pick a time slot.", err_service: "Please pick a service.",
    err_slot: "That slot is taken — please pick another.",
    err_svc_in_use: "This service has bookings and cannot be deleted.",
    confirm_del: "Delete this booking?", confirm_del_svc: "Delete this service?",
    hours_open: "Open",
    hours_close: "Close",
  },
};

let LANG = "zh";
try {
  const saved = localStorage.getItem("bra_lang");
  if (saved === "en" || saved === "zh") {
    LANG = saved;
  } else {
    // One-time migration: the settings form previously stored the UI
    // language inside the app settings record ("br_settings").
    const s = JSON.parse(localStorage.getItem("br_settings") || "{}");
    if (s.lang === "en") LANG = "en";
  }
} catch { /* storage unavailable: keep default */ }

function t(key) {
  return (I18N[LANG] && I18N[LANG][key]) || I18N.zh[key] || key;
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.querySelectorAll("[data-lang-btn]").forEach((b) =>
    b.classList.toggle("active", b.dataset.langBtn === LANG));
  document.documentElement.lang = LANG === "zh" ? "zh-Hant" : "en";
  document.title = t("title");
}

function setLang(next) {
  if (next !== "zh" && next !== "en") return;
  LANG = next;
  try { localStorage.setItem("bra_lang", LANG); } catch { /* ignore */ }
  applyI18n();
  if (typeof renderAll === "function") renderAll();
  if (typeof window.onLangChange === "function") window.onLangChange();
}

document.querySelectorAll("[data-lang-btn]").forEach((b) =>
  b.addEventListener("click", () => setLang(b.dataset.langBtn)));
