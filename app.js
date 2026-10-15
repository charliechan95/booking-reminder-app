/* WhatsApp Booking + Reminders — static UI. Renders from db.js, no backend. */
"use strict";

/* ---- i18n -------------------------------------------------------------- */
const STR = {
  zh: {
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
    hours_hint: "勾選營業的日子，設定開門及關門時間。時段會按服務所需時間自動生成。",
    hours_save: "儲存營業時間",
    set_shop: "店名", set_shop_phone: "店舖 WhatsApp 號碼",
    set_fps_id: "FPS ID", set_fps_name: "FPS 戶口名稱",
    set_payme: "PayMe 名稱", set_dep_mode: "訂金模式",
    dep_flat: "固定金額", dep_percent: "服務價錢百分比",
    set_dep_value: "訂金金額 / 百分比", set_lang: "語言",
    set_save: "儲存設定", set_saved: "設定已儲存 ✓",
    pct_hint: "%（如 50 = 價錢一半）",
    err_name: "請填寫客人姓名。", err_date: "請選擇日期。",
    err_time: "請選擇時段。", err_service: "請選擇服務。",
    err_slot: "該時段已被預約，請選另一時段。",
    err_svc_in_use: "此服務已有預約使用，不能刪除。",
    confirm_del: "確定刪除此預約？", confirm_del_svc: "確定刪除此服務？",
  },
  en: {
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
    hours_hint: "Tick the days you open and set opening/closing times. Slots are generated from the service duration.",
    hours_save: "Save hours",
    set_shop: "Shop name", set_shop_phone: "Shop WhatsApp number",
    set_fps_id: "FPS ID", set_fps_name: "FPS account name",
    set_payme: "PayMe name", set_dep_mode: "Deposit mode",
    dep_flat: "Flat amount", dep_percent: "% of service price",
    set_dep_value: "Deposit amount / %", set_lang: "Language",
    set_save: "Save settings", set_saved: "Settings saved ✓",
    pct_hint: "% (e.g. 50 = half the price)",
    err_name: "Please enter the customer name.", err_date: "Please pick a date.",
    err_time: "Please pick a time slot.", err_service: "Please pick a service.",
    err_slot: "That slot is taken — please pick another.",
    err_svc_in_use: "This service has bookings and cannot be deleted.",
    confirm_del: "Delete this booking?", confirm_del_svc: "Delete this service?",
  },
};

function lang() { return (DB.getSettings().lang === "en") ? "en" : "zh"; }
function t(k) { return (STR[lang()] && STR[lang()][k]) || STR.zh[k] || k; }
function bkLabel(s) { return lang() === "en" ? (BK_LABELS_EN[s] || s) : (BK_LABELS_ZH[s] || s); }
function depLabel(s) { return lang() === "en" ? (DEP_LABELS_EN[s] || s) : (DEP_LABELS_ZH[s] || s); }
function wkLabel(k) { return lang() === "en" ? WEEKDAY_EN[k] : ("星期" + WEEKDAY_ZH[k]); }

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ---- Tabs --------------------------------------------------------------- */
document.querySelectorAll("[data-tab]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((b) =>
      b.classList.toggle("active", b === btn));
    document.querySelectorAll(".view").forEach((v) =>
      v.classList.toggle("active", v.id === "view-" + btn.dataset.tab));
  });
});
function gotoTab(name) {
  const btn = document.querySelector(`[data-tab="${name}"]`);
  if (btn) btn.click();
}

/* ---- Dashboard ------------------------------------------------------------ */
function renderDashboard() {
  const s = DB.stats();
  set("st-today", s.today_count);
  set("st-rate", s.no_show_rate + "%");
  set("st-dep", s.pending_deposits);
  set("st-total", s.total_bookings);
  const today = DB.todayStr();
  const list = DB.query({ dateFrom: today, dateTo: today })
    .filter((b) => b.status === "confirmed");
  document.getElementById("today-body").innerHTML = list.length
    ? list.map(bookingRow).join("")
    : `<tr><td colspan="5" class="muted">${esc(t("no_results"))}</td></tr>`;
  document.getElementById("rate-detail").textContent =
    `${s.week_no_shows}/${s.week_total}`;
}
function set(id, v) { document.getElementById(id).textContent = v; }

/* ---- Bookings -------------------------------------------------------------- */
const filters = { q: "", status: "", date: "" };
let editingId = null;

function renderBookings() {
  const opts = { q: filters.q };
  if (filters.status) opts.status = filters.status;
  if (filters.date) { opts.dateFrom = filters.date; opts.dateTo = filters.date; }
  const list = DB.query(opts);
  document.getElementById("bk-body").innerHTML = list.length
    ? list.map(bookingRow).join("")
    : `<tr><td colspan="5" class="muted">${esc(t("no_results"))}</td></tr>`;
}

function bookingRow(b) {
  const svc = DB.getService(b.service_id);
  const wa = (kind, label) => {
    const url = DB.waLink(b.customer_phone, DB.waMessage(kind, b, lang()));
    if (!url) return `<span class="muted" title="${esc(t("no_phone"))}">${esc(label)}</span>`;
    return `<a class="btn wa" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  };
  const depPill = `<span class="pill dep-${b.deposit_status}">${esc(depLabel(b.deposit_status))}` +
    (b.deposit_amount ? ` $${Math.round(b.deposit_amount)}` : "") + `</span>`;
  return `<tr>
    <td><strong>${esc(b.customer_name)}</strong>
      <div class="muted">${esc(b.customer_phone || "—")}</div></td>
    <td>${esc(DB.serviceName(svc, lang()))}</td>
    <td>${esc(b.date)} <strong>${esc(b.time)}</strong>
      ${b.notes ? `<div class="muted">${esc(b.notes)}</div>` : ""}</td>
    <td><span class="pill st-${b.status}">${esc(bkLabel(b.status))}</span>
      <div style="margin-top:.3rem">${depPill}</div></td>
    <td><div class="row-actions">
      ${wa("confirm", t("wa_confirm"))}
      ${wa("remind", t("wa_remind"))}
      ${b.deposit_status === "pending" ? wa("deposit", t("wa_deposit")) : ""}
      <button data-arrived="${b.id}">${esc(t("st_arrived"))}</button>
      <button data-noshow="${b.id}">${esc(t("st_noshow"))}</button>
      <button data-cancelbk="${b.id}">${esc(t("st_cancel"))}</button>
      ${b.deposit_status === "pending"
        ? `<button data-deppaid="${b.id}">${esc(t("dep_paid"))}</button>
           <button data-depwaive="${b.id}">${esc(t("dep_waive"))}</button>` : ""}
      <button data-editbk="${b.id}">${esc(t("st_edit"))}</button>
      <button data-delbk="${b.id}" class="danger">${esc(t("st_del"))}</button>
    </div></td>
  </tr>`;
}

document.addEventListener("click", (e) => {
  const d = e.target.dataset;
  const refresh = () => { renderDashboard(); renderBookings(); };
  if (d.arrived)   { DB.setStatus(+d.arrived, "arrived"); refresh(); }
  if (d.noshow)    { DB.setStatus(+d.noshow, "no_show"); refresh(); }
  if (d.cancelbk)  { DB.setStatus(+d.cancelbk, "cancelled"); refresh(); }
  if (d.deppaid)   { DB.setDepositStatus(+d.deppaid, "paid"); refresh(); }
  if (d.depwaive)  { DB.setDepositStatus(+d.depwaive, "waived"); refresh(); }
  if (d.delbk && confirm(t("confirm_del"))) { DB.removeBooking(+d.delbk); refresh(); }
  if (d.editbk)    { openBookingForm(+d.editbk); }
});

/* ---- booking form (create + edit) ------------------------------------------- */
function openBookingForm(id) {
  editingId = id || null;
  const b = id ? DB.getBooking(id) : null;
  document.getElementById("bk-form-title").textContent =
    b ? t("edit_booking") : t("new_booking").replace(/^\+ /, "");
  document.getElementById("bk-id").value = b ? b.id : "";
  document.getElementById("bk-name").value = b ? b.customer_name : "";
  document.getElementById("bk-phone").value = b ? (b.customer_phone || "") : "";
  document.getElementById("bk-service").value = b ? b.service_id : "";
  document.getElementById("bk-date").value = b ? b.date : DB.todayStr();
  document.getElementById("bk-notes").value = b ? (b.notes || "") : "";
  document.getElementById("bk-form-wrap").style.display = "";
  refreshSlots(b ? b.time : "");
  gotoTab("bookings");
  document.getElementById("bk-form-wrap").scrollIntoView({ block: "start" });
}
function closeBookingForm() {
  editingId = null;
  document.getElementById("bk-form-wrap").style.display = "none";
}

function refreshSlots(keep) {
  const sel = document.getElementById("bk-slot");
  const svcId = +document.getElementById("bk-service").value;
  const date = document.getElementById("bk-date").value;
  sel.innerHTML = "";
  if (!svcId || !date) {
    sel.innerHTML = `<option value="">${esc(t("pick_service_date"))}</option>`;
    return;
  }
  const slots = DB.availableSlots(date, svcId, editingId);
  if (!slots.length) {
    sel.innerHTML = `<option value="">${esc(t("no_slots"))}</option>`;
    return;
  }
  sel.innerHTML = slots.map((s) =>
    `<option value="${s}"${s === keep ? " selected" : ""}>${s}</option>`).join("");
}

document.getElementById("bk-service").addEventListener("change", () => refreshSlots(""));
document.getElementById("bk-date").addEventListener("change", () => refreshSlots(""));
document.getElementById("bk-cancel").addEventListener("click", closeBookingForm);
document.getElementById("bk-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const err = document.getElementById("bk-err");
  try {
    const payload = {
      customer_name: document.getElementById("bk-name").value,
      customer_phone: document.getElementById("bk-phone").value,
      service_id: +document.getElementById("bk-service").value,
      date: document.getElementById("bk-date").value,
      time: document.getElementById("bk-slot").value,
      notes: document.getElementById("bk-notes").value,
    };
    if (!payload.customer_name.trim()) throw new Error("name_required");
    if (!payload.service_id) throw new Error("service_required");
    if (!payload.date) throw new Error("date_required");
    if (!payload.time) throw new Error("time_required");
    if (editingId) DB.updateBooking(editingId, payload);
    else DB.addBooking(payload);
    err.textContent = "";
    closeBookingForm();
    renderDashboard(); renderBookings();
  } catch (ex) {
    err.textContent = t({
      name_required: "err_name", service_required: "err_service",
      date_required: "err_date", time_required: "err_time",
      slot_taken: "err_slot",
    }[ex.message] || "err_slot");
  }
});

/* ---- filters ---------------------------------------------------------------- */
document.getElementById("f-apply").addEventListener("click", () => {
  filters.q = document.getElementById("f-q").value;
  filters.status = document.getElementById("f-status").value;
  filters.date = document.getElementById("f-date").value;
  renderBookings();
});
document.getElementById("f-reset").addEventListener("click", () => {
  filters.q = ""; filters.status = ""; filters.date = "";
  document.getElementById("f-q").value = "";
  document.getElementById("f-status").value = "";
  document.getElementById("f-date").value = "";
  renderBookings();
});
document.getElementById("btn-new").addEventListener("click", () => openBookingForm(null));
document.getElementById("view-all").addEventListener("click", () => gotoTab("bookings"));

/* ---- services ---------------------------------------------------------------- */
function renderServices() {
  const all = DB.listServices();
  document.getElementById("svc-body").innerHTML = all.length
    ? all.map((s) => `<tr>
        <td><strong>${esc(s.name_zh || "—")}</strong>
          <div class="muted">${esc(s.name_en || "")}</div></td>
        <td>${s.duration_min} min</td>
        <td>$${Math.round(s.price_hkd)}</td>
        <td><div class="row-actions">
          <button data-delsvc="${s.id}" class="danger">${esc(t("st_del"))}</button>
        </div></td>
      </tr>`).join("")
    : `<tr><td colspan="4" class="muted">${esc(t("no_results"))}</td></tr>`;
}
document.getElementById("svc-form").addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    DB.addService({
      name_zh: document.getElementById("svc-zh").value,
      name_en: document.getElementById("svc-en").value,
      duration_min: document.getElementById("svc-dur").value,
      price_hkd: document.getElementById("svc-price").value,
    });
    document.getElementById("svc-form").reset();
    document.getElementById("svc-err").textContent = "";
    renderServices(); fillServiceSelect();
  } catch (ex) {
    document.getElementById("svc-err").textContent =
      ex.message === "service_in_use" ? t("err_svc_in_use") : t("err_name");
  }
});
document.addEventListener("click", (e) => {
  if (e.target.dataset.delsvc) {
    try {
      if (!confirm(t("confirm_del_svc"))) return;
      DB.removeService(+e.target.dataset.delsvc);
      document.getElementById("svc-err").textContent = "";
      renderServices(); fillServiceSelect();
    } catch (ex) {
      document.getElementById("svc-err").textContent = t("err_svc_in_use");
    }
  }
});
function fillServiceSelect() {
  const sel = document.getElementById("bk-service");
  const cur = sel.value;
  sel.innerHTML = DB.listServices().map((s) =>
    `<option value="${s.id}">${esc(DB.serviceName(s, lang()))} ($${Math.round(s.price_hkd)})</option>`).join("");
  if (cur) sel.value = cur;
}

/* ---- hours ------------------------------------------------------------------- */
function renderHours() {
  const h = DB.getHours();
  document.getElementById("hours-body").innerHTML = WEEKDAYS.map((k) => {
    const d = h[k] || {};
    return `<tr>
      <td><label><input type="checkbox" data-day="${k}" data-f="enabled"${d.enabled ? " checked" : ""}>
        <strong>${esc(wkLabel(k))}</strong></label></td>
      <td><input type="time" data-day="${k}" data-f="open" value="${esc(d.open || "09:00")}"></td>
      <td><input type="time" data-day="${k}" data-f="close" value="${esc(d.close || "18:00")}"></td>
    </tr>`;
  }).join("");
}
document.getElementById("hours-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const h = {};
  WEEKDAYS.forEach((k) => {
    h[k] = {
      enabled: document.querySelector(`[data-day="${k}"][data-f="enabled"]`).checked,
      open: document.querySelector(`[data-day="${k}"][data-f="open"]`).value || "09:00",
      close: document.querySelector(`[data-day="${k}"][data-f="close"]`).value || "18:00",
    };
  });
  DB.saveHours(h);
});

/* ---- settings ------------------------------------------------------------------ */
function renderSettings() {
  const s = DB.getSettings();
  const g = (id) => document.getElementById(id);
  g("set-shop").value = s.shop_name || "";
  g("set-shop-phone").value = s.shop_phone || "";
  g("set-fps-id").value = s.fps_id || "";
  g("set-fps-name").value = s.fps_name || "";
  g("set-payme").value = s.payme_name || "";
  g("set-dep-mode").value = s.deposit_mode || "flat";
  g("set-dep-value").value = s.deposit_value || "100";
  g("set-lang").value = s.lang || "zh";
}
document.getElementById("settings-form").addEventListener("submit", (e) => {
  e.preventDefault();
  DB.saveSettings({
    shop_name: document.getElementById("set-shop").value,
    shop_phone: document.getElementById("set-shop-phone").value,
    fps_id: document.getElementById("set-fps-id").value,
    fps_name: document.getElementById("set-fps-name").value,
    payme_name: document.getElementById("set-payme").value,
    deposit_mode: document.getElementById("set-dep-mode").value,
    deposit_value: document.getElementById("set-dep-value").value,
    lang: document.getElementById("set-lang").value,
  });
  applyI18n();
  renderAll();
  const ok = document.getElementById("set-ok");
  ok.style.display = "";
  setTimeout(() => { ok.style.display = "none"; }, 2500);
});

/* ---- i18n application ------------------------------------------------------------ */
function applyI18n() {
  document.documentElement.lang = lang() === "en" ? "en" : "zh-Hant";
  document.title = t("app_title");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.getElementById("f-status").innerHTML =
    `<option value="">${esc(t("all_status"))}</option>` +
    BK_STATUSES.map((s) => `<option value="${s}">${esc(bkLabel(s))}</option>`).join("");
  document.getElementById("f-status").value = filters.status;
}

/* ---- boot ------------------------------------------------------------------------- */
function renderAll() {
  applyI18n();
  renderDashboard();
  renderBookings();
  renderServices();
  fillServiceSelect();
  renderHours();
  renderSettings();
}
renderAll();
