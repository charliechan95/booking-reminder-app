/* WhatsApp Booking + Reminders — static data layer.
   localStorage-backed, no backend. WhatsApp via wa.me deep links (no paid API). */
"use strict";

function _lang() {
  try { return localStorage.getItem("bra_lang") || "zh"; } catch { return "zh"; }
}
function _en() { return _lang() === "en"; }

const BK_STATUSES = ["confirmed", "arrived", "no_show", "cancelled", "rescheduled"];
const BK_LABELS_ZH = {
  confirmed: "已確認", arrived: "已到達", no_show: "爽約",
  cancelled: "已取消", rescheduled: "已改期",
};
const BK_LABELS_EN = {
  confirmed: "Confirmed", arrived: "Arrived", no_show: "No-show",
  cancelled: "Cancelled", rescheduled: "Rescheduled",
};

const DEP_STATUSES = ["pending", "paid", "waived"];
const DEP_LABELS_ZH = { pending: "待付", paid: "已付", waived: "豁免" };
const DEP_LABELS_EN = { pending: "Pending", paid: "Paid", waived: "Waived" };

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const WEEKDAY_ZH = { sun: "日", mon: "一", tue: "二", wed: "三", thu: "四", fri: "五", sat: "六" };
const WEEKDAY_EN = { sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat" };

const DEFAULT_HOURS = {
  mon: { enabled: true,  open: "09:00", close: "18:00" },
  tue: { enabled: true,  open: "09:00", close: "18:00" },
  wed: { enabled: true,  open: "09:00", close: "18:00" },
  thu: { enabled: true,  open: "09:00", close: "18:00" },
  fri: { enabled: true,  open: "09:00", close: "18:00" },
  sat: { enabled: true,  open: "09:00", close: "18:00" },
  sun: { enabled: false, open: "09:00", close: "18:00" },
};

const WA_TPL_KEYS = { confirm: "wa_tpl_confirm", remind: "wa_tpl_remind", deposit: "wa_tpl_deposit" };

const DEFAULT_SETTINGS = {
  shop_name: "",
  shop_phone: "",
  fps_id: "",
  fps_name: "",
  payme_name: "",
  deposit_mode: "flat",   // "flat" | "percent"
  deposit_value: "100",
  lang: "zh",             // "zh" | "en" (legacy; UI language now lives in bra_lang)
  wa_tpl_confirm: "",    // saved custom templates: used verbatim, never overridden
  wa_tpl_remind: "",
  wa_tpl_deposit: "",
};

const WA_TEMPLATES = {
  confirm: {
    zh: "您好{name}！這裡是{shop}，已為您確認預約：{service}，日期{date}，時間{time}。如需更改或取消，請盡早通知我們。謝謝！",
    en: "Hi {name}! This is {shop}. Your booking is confirmed: {service} on {date} at {time}. Please let us know early if you need to change or cancel. Thank you!",
  },
  remind: {
    zh: "您好{name}！溫馨提醒：您在{shop}的預約是{date} {time}（{service}）。請準時到達，如需改期請回覆此訊息。謝謝！",
    en: "Hi {name}! Friendly reminder: your appointment at {shop} is on {date} at {time} ({service}). Please arrive on time — reply here if you need to reschedule. Thank you!",
  },
  deposit: {
    zh: "您好{name}！這裡是{shop}。您{date} {time}的{service}預約，需要先付${amount}訂金作實。請FPS到{fps_id}（{fps_name}），並回傳付款截圖。謝謝！",
    en: "Hi {name}! This is {shop}. To confirm your {service} booking on {date} at {time}, please pay a ${amount} deposit via FPS to {fps_id} ({fps_name}) and send a screenshot of the payment. Thank you!",
  },
};

const DB = {
  /* ---- low-level storage --------------------------------------------- */
  _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  _write(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  _nextId() {
    const n = (parseInt(localStorage.getItem("br_seq") || "0", 10) || 0) + 1;
    localStorage.setItem("br_seq", String(n));
    return n;
  },

  /* ---- small shared helpers ------------------------------------------- */
  pad(n) { return String(n).padStart(2, "0"); },
  todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}`;
  },
  daysAgoStr(n) {
    const d = new Date(); d.setDate(d.getDate() - n);
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}`;
  },
  weekdayKey(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return WEEKDAYS[new Date(y, m - 1, d).getDay()];
  },
  toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  },
  toHHMM(mins) {
    return `${this.pad(Math.floor(mins / 60))}:${this.pad(mins % 60)}`;
  },
  fmtDate(dateStr, lang) {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (lang === "en") {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${d} ${months[m - 1]} ${y}`;
    }
    return `${y}年${m}月${d}日`;
  },
  /** Normalize an HK mobile number for wa.me (digits only, country code). */
  normalizePhone(phone) {
    if (!phone) return "";
    let p = String(phone).replace(/[\s\-()]/g, "");
    if (p.startsWith("+")) p = p.slice(1);
    if (/^852\d{8}$/.test(p)) return p;
    if (/^[456789]\d{7}$/.test(p)) return "852" + p;
    return p.replace(/\D/g, "");
  },

  /* ---- settings -------------------------------------------------------- */
  getSettings() { return Object.assign({}, DEFAULT_SETTINGS, this._read("br_settings", {})); },
  saveSettings(s) { this._write("br_settings", s); },

  /* ---- services -------------------------------------------------------- */
  listServices() { return this._read("br_services", []); },
  addService(s) {
    const all = this.listServices();
    const rec = {
      id: this._nextId(),
      name_zh: (s.name_zh || "").trim(),
      name_en: (s.name_en || "").trim(),
      duration_min: Math.max(5, parseInt(s.duration_min, 10) || 30),
      price_hkd: Math.max(0, parseFloat(s.price_hkd) || 0),
    };
    if (!rec.name_zh && !rec.name_en) throw new Error("service_name_required");
    all.push(rec); this._write("br_services", all);
    return rec;
  },
  updateService(id, patch) {
    const all = this.listServices();
    const rec = all.find((x) => x.id === id);
    if (!rec) throw new Error("service_not_found");
    Object.assign(rec, patch); this._write("br_services", all);
    return rec;
  },
  removeService(id) {
    const used = this.listBookings().some((b) => b.service_id === id);
    if (used) throw new Error("service_in_use");
    this._write("br_services", this.listServices().filter((x) => x.id !== id));
  },
  getService(id) { return this.listServices().find((x) => x.id === id) || null; },
  serviceName(s, lang) {
    if (!s) return "—";
    if (lang === "en") return s.name_en || s.name_zh || "—";
    return s.name_zh || s.name_en || "—";
  },

  /* ---- working hours --------------------------------------------------- */
  getHours() { return Object.assign({}, DEFAULT_HOURS, this._read("br_hours", {})); },
  saveHours(h) { this._write("br_hours", h); },

  /* ---- slots ----------------------------------------------------------- */
  /** Times (HH:MM) free on dateStr for a service; excludes booked slots. */
  availableSlots(dateStr, serviceId, excludeId) {
    const svc = this.getService(serviceId);
    if (!svc) return [];
    const day = this.getHours()[this.weekdayKey(dateStr)];
    if (!day || !day.enabled) return [];
    const start = this.toMinutes(day.open), end = this.toMinutes(day.close);
    const dur = svc.duration_min;
    const taken = new Set(
      this.listBookings()
        .filter((b) => b.date === dateStr && b.status !== "cancelled" &&
                       b.status !== "rescheduled" && b.id !== excludeId)
        .map((b) => b.time)
    );
    const out = [];
    for (let t = start; t + dur <= end; t += dur) {
      const hhmm = this.toHHMM(t);
      if (!taken.has(hhmm)) out.push(hhmm);
    }
    return out;
  },

  /* ---- bookings -------------------------------------------------------- */
  listBookings() { return this._read("br_bookings", []); },
  getBooking(id) { return this.listBookings().find((b) => b.id === id) || null; },
  _saveBookings(all) { this._write("br_bookings", all); },

  depositAmountFor(serviceId) {
    const st = this.getSettings();
    const svc = this.getService(serviceId);
    if (!svc) return 0;
    if (st.deposit_mode === "percent") {
      const pct = parseFloat(st.deposit_value) || 0;
      return Math.round(svc.price_hkd * pct / 100);
    }
    return Math.max(0, Math.round(parseFloat(st.deposit_value) || 0));
  },

  addBooking(b) {
    const name = (b.customer_name || "").trim();
    if (!name) throw new Error("name_required");
    if (!b.date) throw new Error("date_required");
    if (!b.time) throw new Error("time_required");
    const svc = this.getService(b.service_id);
    if (!svc) throw new Error("service_required");
    const taken = this.availableSlots(b.date, b.service_id, null);
    if (!taken.includes(b.time)) throw new Error("slot_taken");
    const all = this.listBookings();
    const rec = {
      id: this._nextId(),
      customer_name: name,
      customer_phone: (b.customer_phone || "").trim(),
      service_id: b.service_id,
      date: b.date,
      time: b.time,
      notes: (b.notes || "").trim(),
      status: "confirmed",
      deposit_status: this.depositAmountFor(b.service_id) > 0 ? "pending" : "waived",
      deposit_amount: this.depositAmountFor(b.service_id),
      created_at: new Date().toISOString(),
    };
    all.push(rec); this._saveBookings(all);
    return rec;
  },
  updateBooking(id, patch) {
    const all = this.listBookings();
    const rec = all.find((b) => b.id === id);
    if (!rec) throw new Error("booking_not_found");
    const newDate = patch.date !== undefined ? patch.date : rec.date;
    const newTime = patch.time !== undefined ? patch.time : rec.time;
    const newSvc = patch.service_id !== undefined ? patch.service_id : rec.service_id;
    if (newDate !== rec.date || newTime !== rec.time || newSvc !== rec.service_id) {
      const taken = this.availableSlots(newDate, newSvc, id);
      if (!taken.includes(newTime)) throw new Error("slot_taken");
    }
    Object.assign(rec, patch); this._saveBookings(all);
    return rec;
  },
  setStatus(id, status) {
    if (!BK_STATUSES.includes(status)) throw new Error("bad_status");
    return this.updateBooking(id, { status });
  },
  setDepositStatus(id, depStatus) {
    if (!DEP_STATUSES.includes(depStatus)) throw new Error("bad_deposit_status");
    return this.updateBooking(id, { deposit_status: depStatus });
  },
  removeBooking(id) {
    this._saveBookings(this.listBookings().filter((b) => b.id !== id));
  },

  /** Filtered, sorted list. opts: {q, dateFrom, dateTo, status} */
  query(opts) {
    opts = opts || {};
    const q = (opts.q || "").trim().toLowerCase();
    let out = this.listBookings();
    if (q) out = out.filter((b) =>
      (b.customer_name || "").toLowerCase().includes(q) ||
      (b.customer_phone || "").includes(q));
    if (opts.dateFrom) out = out.filter((b) => b.date >= opts.dateFrom);
    if (opts.dateTo) out = out.filter((b) => b.date <= opts.dateTo);
    if (opts.status) out = out.filter((b) => b.status === opts.status);
    out.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    return out;
  },

  /* ---- WhatsApp --------------------------------------------------------- */
  waLink(phone, text) {
    const num = this.normalizePhone(phone);
    if (!num) return "";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
  },
  /** Effective WhatsApp template for a message kind.
      A saved custom template is used verbatim in both languages and never
      overridden by a language switch; otherwise the default for the current
      UI language applies. */
  waTemplate(kind, lang) {
    const st = this.getSettings();
    const saved = (st[WA_TPL_KEYS[kind] || WA_TPL_KEYS.confirm] || "").trim();
    if (saved) return saved;
    const l = lang || _lang();
    const d = WA_TEMPLATES[kind] || WA_TEMPLATES.confirm;
    return d[l] || d.zh;
  },
  waMessage(kind, booking, lang) {
    const st = this.getSettings();
    const svc = this.getService(booking.service_id);
    const lang2 = lang || _lang();
    const tpl = this.waTemplate(kind, lang2);
    return tpl
      .replaceAll("{name}", booking.customer_name)
      .replaceAll("{shop}", st.shop_name || (lang2 === "en" ? "our shop" : "本店"))
      .replaceAll("{service}", this.serviceName(svc, lang2))
      .replaceAll("{date}", this.fmtDate(booking.date, lang2))
      .replaceAll("{time}", booking.time)
      .replaceAll("{amount}", String(booking.deposit_amount))
      .replaceAll("{fps_id}", st.fps_id || "—")
      .replaceAll("{fps_name}", st.fps_name || "");
  },

  /* ---- dashboard stats --------------------------------------------------- */
  stats() {
    const today = this.todayStr(), weekAgo = this.daysAgoStr(7);
    const all = this.listBookings();
    const todayCount = all.filter((b) => b.date === today && b.status === "confirmed").length;
    const weekDone = all.filter((b) => b.date >= weekAgo && b.date <= today &&
      (b.status === "arrived" || b.status === "no_show"));
    const noShows = weekDone.filter((b) => b.status === "no_show").length;
    const noShowRate = weekDone.length ? Math.round(noShows / weekDone.length * 100) : 0;
    const pendingDeposits = all.filter((b) => b.deposit_status === "pending" &&
      b.status === "confirmed" && b.date >= today).length;
    return {
      today_count: todayCount,
      week_total: weekDone.length,
      week_no_shows: noShows,
      no_show_rate: noShowRate,
      pending_deposits: pendingDeposits,
      total_bookings: all.length,
    };
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DB, BK_STATUSES, DEP_STATUSES, DEFAULT_HOURS, DEFAULT_SETTINGS, WA_TEMPLATES, WA_TPL_KEYS };
}
