/* WhatsApp Booking + Reminders — static UI. Renders from db.js, no backend. */
"use strict";

/* ---- i18n -------------------------------------------------------------- */
/* Dictionary + language state (I18N, LANG, t, setLang) live in i18n.js.
   Label helpers below display canonical stored values in the UI language. */
function bkLabel(s) { return LANG === "en" ? (BK_LABELS_EN[s] || s) : (BK_LABELS_ZH[s] || s); }
function depLabel(s) { return LANG === "en" ? (DEP_LABELS_EN[s] || s) : (DEP_LABELS_ZH[s] || s); }
function wkLabel(k) { return LANG === "en" ? WEEKDAY_EN[k] : ("星期" + WEEKDAY_ZH[k]); }

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
    const url = DB.waLink(b.customer_phone, DB.waMessage(kind, b, LANG));
    if (!url) return `<span class="muted" title="${esc(t("no_phone"))}">${esc(label)}</span>`;
    return `<a class="btn wa" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  };
  const depPill = `<span class="pill dep-${b.deposit_status}">${esc(depLabel(b.deposit_status))}` +
    (b.deposit_amount ? ` $${Math.round(b.deposit_amount)}` : "") + `</span>`;
  return `<tr>
    <td><strong>${esc(b.customer_name)}</strong>
      <div class="muted">${esc(b.customer_phone || "—")}</div></td>
    <td>${esc(DB.serviceName(svc, LANG))}</td>
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
let editingSvcId = null;

function renderServices() {
  const all = DB.listServices();
  document.getElementById("svc-body").innerHTML = all.length
    ? all.map((s) => `<tr>
        <td><strong>${esc(s.name_zh || "—")}</strong>
          <div class="muted">${esc(s.name_en || "")}</div></td>
        <td>${s.duration_min} min</td>
        <td>$${Math.round(s.price_hkd)}</td>
        <td><div class="row-actions">
          <button data-editsvc="${s.id}">${esc(t("st_edit"))}</button>
          <button data-delsvc="${s.id}" class="danger">${esc(t("st_del"))}</button>
        </div></td>
      </tr>`).join("")
    : `<tr><td colspan="4" class="muted">${esc(t("no_results"))}</td></tr>`;
}
/* Edit reuses the same form as create (mirrors openBookingForm): prefill the
   fields, switch the submit label, cancel returns to create mode. */
function openServiceForm(id) {
  const s = id ? DB.getService(id) : null;
  editingSvcId = s ? s.id : null;
  document.getElementById("svc-zh").value = s ? (s.name_zh || "") : "";
  document.getElementById("svc-en").value = s ? (s.name_en || "") : "";
  document.getElementById("svc-dur").value = s ? s.duration_min : 60;
  document.getElementById("svc-price").value = s ? Math.round(s.price_hkd) : 0;
  document.getElementById("svc-submit").textContent =
    s ? t("svc_update") : t("svc_add");
  document.getElementById("svc-cancel").style.display = s ? "" : "none";
  document.getElementById("svc-err").textContent = "";
  gotoTab("services");
  document.getElementById("svc-form").scrollIntoView({ block: "start" });
}
function closeServiceForm() {
  editingSvcId = null;
  document.getElementById("svc-form").reset();
  document.getElementById("svc-submit").textContent = t("svc_add");
  document.getElementById("svc-cancel").style.display = "none";
  document.getElementById("svc-err").textContent = "";
}
document.getElementById("svc-cancel").addEventListener("click", closeServiceForm);
document.getElementById("svc-form").addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    const payload = {
      name_zh: document.getElementById("svc-zh").value,
      name_en: document.getElementById("svc-en").value,
      duration_min: document.getElementById("svc-dur").value,
      price_hkd: document.getElementById("svc-price").value,
    };
    if (editingSvcId) DB.updateService(editingSvcId, payload);
    else DB.addService(payload);
    const wasEdit = editingSvcId;
    closeServiceForm();
    renderServices(); fillServiceSelect();
    if (wasEdit) renderBookings(); // names may have changed
  } catch (ex) {
    document.getElementById("svc-err").textContent =
      ex.message === "service_in_use" ? t("err_svc_in_use") : t("err_name");
  }
});
document.addEventListener("click", (e) => {
  if (e.target.dataset.editsvc) { openServiceForm(+e.target.dataset.editsvc); }
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
    `<option value="${s.id}">${esc(DB.serviceName(s, LANG))} ($${Math.round(s.price_hkd)})</option>`).join("");
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
  g("set-lang").value = LANG;
  g("set-tpl-confirm").value = DB.waTemplate("confirm");
  g("set-tpl-remind").value = DB.waTemplate("remind");
  g("set-tpl-deposit").value = DB.waTemplate("deposit");
}

/* A template box counts as custom only when its text differs from the
   built-in default for the current language; otherwise store "" so the
   template keeps following the app language automatically. */
function tplValue(id, kind) {
  const v = document.getElementById(id).value.trim();
  if (!v) return "";
  const d = ((WA_TEMPLATES[kind] || {})[LANG]
    || (WA_TEMPLATES[kind] || {}).zh || "").trim();
  return v === d ? "" : v;
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
    wa_tpl_confirm: tplValue("set-tpl-confirm", "confirm"),
    wa_tpl_remind: tplValue("set-tpl-remind", "remind"),
    wa_tpl_deposit: tplValue("set-tpl-deposit", "deposit"),
  });
  setLang(document.getElementById("set-lang").value); // persists + applyI18n + renderAll
  const ok = document.getElementById("set-ok");
  ok.style.display = "";
  setTimeout(() => { ok.style.display = "none"; }, 2500);
});

/* ---- backup: export / import --------------------------------------------------- */
document.getElementById("btn-export").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(DB.exportData(), null, 2)],
    { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "booking-reminder-backup-" + DB.todayStr() + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
});
document.getElementById("btn-import").addEventListener("click", () => {
  document.getElementById("file-import").click();
});
document.getElementById("file-import").addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!f) return;
  const msg = document.getElementById("backup-msg");
  const reader = new FileReader();
  const fail = () => { msg.className = "err"; msg.textContent = t("backup_bad"); };
  reader.onload = () => {
    try {
      DB.importData(JSON.parse(reader.result));
      msg.className = "ok";
      msg.textContent = t("backup_ok");
      renderAll();
    } catch { fail(); }
  };
  reader.onerror = fail;
  reader.readAsText(f);
});

/* ---- storage failure signal --------------------------------------------------- */
/* DB._write failures surface here as a visible banner (see db.js _writeFailed). */
DB.onWriteError = () => {
  const el = document.getElementById("storage-err");
  if (el) { el.style.display = ""; el.textContent = t("err_storage"); }
};

/* ---- i18n application ------------------------------------------------------------ */
/* Rebuilds the dynamically-rendered status filter in the UI language.
   Called on every language switch via setLang (i18n.js). */
window.onLangChange = function () {
  const sel = document.getElementById("f-status");
  sel.innerHTML =
    `<option value="">${esc(t("all_status"))}</option>` +
    BK_STATUSES.map((s) => `<option value="${s}">${esc(bkLabel(s))}</option>`).join("");
  sel.value = filters.status;
  /* applyI18n resets the service submit button to svc_add; restore edit label. */
  if (editingSvcId) {
    document.getElementById("svc-submit").textContent = t("svc_update");
  }
};

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
window.onLangChange(); // build the status filter once at boot (rebuilt on every setLang)
renderAll();
