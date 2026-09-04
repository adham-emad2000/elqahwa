import { useState, useEffect } from "react";

const PASSWORD = "harafesh";
const STORAGE_KEY = "coffee-ledger";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getSheetTimestamp() {
  const d = new Date();
  const date = d.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
  });
  const time = d.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} - ${time}`;
}

function defaultData() {
  return {
    sheets: [
      { id: uid(), name: "ورقة 1", timeStamp: getSheetTimestamp(), orders: [] },
    ],
  };
}

function fmt(n) {
  return (Math.round(n * 100) / 100).toLocaleString("ar-EG") + " ج.م";
}

function timeLabel(ts) {
  const d = new Date(ts);
  const time = d.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = d.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
  });
  return { date, time };
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2C11 5.1 11.5 5 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.4 6.4A17.7 17.7 0 0 0 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.6-.7" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function PasswordField({
  value,
  onChange,
  show,
  onToggleShow,
  onEnter,
  autoFocus,
}) {
  return (
    <div className="relative">
      <input
        autoFocus={autoFocus}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder="●●●●●●●●"
        className="w-full text-center tracking-widest px-4 py-3 pl-11 rounded-lg border border-[#3d2e22] bg-[#1b1410] text-[#f3e9da] outline-none focus:border-[#d98f4f]"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b8a48d] hover:text-[#f3e9da]"
        tabIndex={-1}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [data, setData] = useState(null);
  const [activeSheetId, setActiveSheetId] = useState(null);
  const [addingSheet, setAddingSheet] = useState(false);
  const [newSheetName, setNewSheetName] = useState("");
  const [form, setForm] = useState({ name: "", drink: "", price: "" });

  const [sheetToDelete, setSheetToDelete] = useState(null);
  const [deletePw, setDeletePw] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [deletePwError, setDeletePwError] = useState(false);

  useEffect(() => {
    if (!unlocked) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    let loaded;
    try {
      loaded = raw ? JSON.parse(raw) : null;
    } catch {
      loaded = null;
    }
    if (!loaded || !loaded.sheets) loaded = defaultData();
    setData(loaded);
    if (loaded.sheets.length > 0) {
      setActiveSheetId(loaded.sheets[0].id);
    }
  }, [unlocked]);

  useEffect(() => {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function tryUnlock() {
    if (pw === PASSWORD) {
      setUnlocked(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  if (!unlocked) {
    return (
      <div
        dir="rtl"
        className="bg-grain min-h-screen flex flex-col items-center justify-center bg-[#1b1410] px-4 py-10"
      >
        <div className="bg-[#241a14] border border-[#3d2e22] rounded-2xl p-9 w-full max-w-sm text-center shadow-lg shadow-black/30">
          <svg
            className="w-11 h-11 mx-auto mb-3 text-[#d98f4f]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <rect x="4" y="10.5" width="16" height="10" rx="2" />
            <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
          </svg>
          <h1 className="text-2xl font-black text-[#f3e9da] animate-title">
            دفتر قهوتنا
          </h1>
          <p className="text-sm text-[#b8a48d] mt-1 mb-6">
            اكتب الباسورد عشان تدخل الدفتر
          </p>

          <PasswordField
            value={pw}
            onChange={setPw}
            show={showPw}
            onToggleShow={() => setShowPw((v) => !v)}
            onEnter={tryUnlock}
          />

          <button
            onClick={tryUnlock}
            className="w-full mt-3 py-3 rounded-lg bg-[#c97a3a] text-[#1b1410] font-bold active:scale-[0.98] transition"
          >
            دخول
          </button>
          <div className="h-4 mt-2 text-sm text-[#e2685a]">
            {pwError && "الباسورد غلط، جرب تاني"}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // لو مفيش أي ورقة، انشئ ورقة جديدة افتراضياً
  if (data.sheets.length === 0) {
    const freshSheet = {
      id: uid(),
      name: "ورقة 1",
      timeStamp: getSheetTimestamp(),
      orders: [],
    };
    setData({ sheets: [freshSheet] });
    setActiveSheetId(freshSheet.id);
    return null;
  }

  const sheet =
    data.sheets.find((s) => s.id === activeSheetId) ?? data.sheets[0];
  const total = sheet.orders.reduce((a, o) => a + o.price, 0);
  const paidSum = sheet.orders
    .filter((o) => o.paid)
    .reduce((a, o) => a + o.price, 0);
  const remaining = total - paidSum;

  function updateSheet(sheetId, updater) {
    setData((prev) => ({
      ...prev,
      sheets: prev.sheets.map((s) => (s.id === sheetId ? updater(s) : s)),
    }));
  }

  function addOrder() {
    const price = parseFloat(form.price);
    if (!form.name.trim() || !form.drink.trim() || isNaN(price) || price < 0)
      return;
    updateSheet(sheet.id, (s) => ({
      ...s,
      orders: [
        ...s.orders,
        {
          id: uid(),
          name: form.name.trim(),
          drink: form.drink.trim(),
          price,
          ts: Date.now(),
          paid: false,
        },
      ],
    }));
    setForm({ name: "", drink: "", price: "" });
  }

  function togglePaid(orderId) {
    updateSheet(sheet.id, (s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, paid: !o.paid } : o,
      ),
    }));
  }

  function confirmAddSheet() {
    const name = newSheetName.trim() || `ورقة ${data.sheets.length + 1}`;
    const newSheet = {
      id: uid(),
      name,
      timeStamp: getSheetTimestamp(),
      orders: [],
    };
    setData((prev) => ({ ...prev, sheets: [...prev.sheets, newSheet] }));
    setActiveSheetId(newSheet.id);
    setAddingSheet(false);
    setNewSheetName("");
  }

  function startDeleteSheet(id) {
    setSheetToDelete(id);
    setDeletePw("");
    setShowDeletePw(false);
    setDeletePwError(false);
  }

  function cancelDeleteSheet() {
    setSheetToDelete(null);
    setDeletePw("");
    setDeletePwError(false);
  }

  function confirmDeleteSheet() {
    if (deletePw !== PASSWORD) {
      setDeletePwError(true);
      return;
    }
    const remainingSheets = data.sheets.filter((s) => s.id !== sheetToDelete);
    setData((prev) => ({ ...prev, sheets: remainingSheets }));
    if (remainingSheets.length > 0) {
      setActiveSheetId(remainingSheets[0].id);
    }
    cancelDeleteSheet();
  }

  const sortedOrders = [...sheet.orders].sort((a, b) => b.ts - a.ts);

  return (
    <div
      dir="rtl"
      className="bg-grain min-h-screen bg-[#1b1410] text-[#f3e9da]"
    >
      <div className="max-w-2xl mx-auto px-4 py-6 pb-16">
        <header className="flex items-baseline justify-between border-b-2 border-[#3d2e22] pb-4 mb-5">
          <div>
            <h1 className="text-4xl md:text-5xl font-black animate-title">
              دفتر قهوتنا ☕
            </h1>
            <p className="text-sm text-[#b8a48d] mt-1">
              حسابات القهوة بينك وبين زمايلك
            </p>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
          {data.sheets.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSheetId(s.id);
                cancelDeleteSheet();
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm border transition whitespace-nowrap ${
                s.id === activeSheetId
                  ? "bg-[#c97a3a] border-[#c97a3a] text-[#1b1410] font-bold"
                  : "bg-[#241a14] border-[#3d2e22] text-[#b8a48d]"
              }`}
            >
              {s.name}
            </button>
          ))}
          <button
            onClick={() => setAddingSheet(true)}
            className="shrink-0 w-9 h-9 rounded-full border border-dashed border-[#d98f4f] text-[#d98f4f] flex items-center justify-center text-lg"
          >
            +
          </button>
        </div>

        {addingSheet && (
          <div className="flex gap-2 mb-4">
            <input
              autoFocus
              value={newSheetName}
              onChange={(e) => setNewSheetName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmAddSheet()}
              placeholder="اسم الورقة الجديدة"
              className="flex-1 px-3 py-2 rounded-lg border border-[#3d2e22] bg-[#241a14] text-[#f3e9da] text-sm"
            />
            <button
              onClick={confirmAddSheet}
              className="px-4 py-2 rounded-lg bg-[#c97a3a] text-[#1b1410] text-sm font-bold"
            >
              إضافة
            </button>
            <button
              onClick={() => setAddingSheet(false)}
              className="px-4 py-2 rounded-lg bg-[#2c2019] text-[#b8a48d] text-sm font-bold"
            >
              إلغاء
            </button>
          </div>
        )}

        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            <h2 className="text-lg font-bold">{sheet.name}</h2>
            {sheet.timeStamp && (
              <p className="text-xs text-[#b8a48d] mt-0.5">
                تاريخ الإنشاء: {sheet.timeStamp} 🗓️
              </p>
            )}
          </div>
          {sheetToDelete !== sheet.id && (
            <button
              onClick={() => startDeleteSheet(sheet.id)}
              className="text-xs underline text-[#b8a48d] shrink-0 hover:text-[#e2685a]"
            >
              حذف الورقة
            </button>
          )}
        </div>

        {sheetToDelete === sheet.id && (
          <div className="bg-[#2c1a17] border border-[#5a2e28] rounded-lg p-4 mb-5">
            <p className="text-sm text-[#e2685a] mb-3 font-bold">
              اكتب الباسورد عشان تأكد حذف "{sheet.name}"
            </p>
            <PasswordField
              value={deletePw}
              onChange={setDeletePw}
              show={showDeletePw}
              onToggleShow={() => setShowDeletePw((v) => !v)}
              onEnter={confirmDeleteSheet}
              autoFocus
            />
            {deletePwError && (
              <div className="text-sm text-[#e2685a] mt-2">
                الباسورد غلط، جرب تاني
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={confirmDeleteSheet}
                className="flex-1 py-2.5 rounded-lg bg-[#e2685a] text-[#1b1410] text-sm font-bold"
              >
                تأكيد الحذف
              </button>
              <button
                onClick={cancelDeleteSheet}
                className="flex-1 py-2.5 rounded-lg bg-[#2c2019] text-[#b8a48d] text-sm font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-5">
          <div className="bg-[#241a14] border border-[#3d2e22] rounded-lg p-2 sm:p-3 text-center">
            <div className="text-base sm:text-xl font-black">{fmt(total)}</div>
            <div className="text-[9px] sm:text-[11px] text-[#b8a48d] mt-0.5">
              إجمالي القعدة
            </div>
          </div>
          <div className="bg-[#241a14] border border-[#3d2e22] rounded-lg p-2 sm:p-3 text-center">
            <div className="text-base sm:text-xl font-black text-[#8fbf7a]">
              {fmt(paidSum)}
            </div>
            <div className="text-[9px] sm:text-[11px] text-[#b8a48d] mt-0.5">
              اتحاسب
            </div>
          </div>
          <div className="bg-[#241a14] border border-[#3d2e22] rounded-lg p-2 sm:p-3 text-center">
            <div className="text-base sm:text-xl font-black text-[#e2685a]">
              {fmt(remaining)}
            </div>
            <div className="text-[9px] sm:text-[11px] text-[#b8a48d] mt-0.5">
              الباقي
            </div>
          </div>
        </div>

        <div className="bg-[#241a14] border border-[#3d2e22] rounded-lg p-3.5 mb-5">
          <div className="flex flex-wrap gap-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="اسم الزبون"
              className="flex-1 min-w-[90px] px-3 py-2.5 rounded-lg border border-[#3d2e22] bg-[#1b1410] text-[#f3e9da] text-sm outline-none focus:border-[#d98f4f]"
            />
            <input
              value={form.drink}
              onChange={(e) => setForm({ ...form, drink: e.target.value })}
              placeholder="المشروب"
              className="flex-1 min-w-[90px] px-3 py-2.5 rounded-lg border border-[#3d2e22] bg-[#1b1410] text-[#f3e9da] text-sm outline-none focus:border-[#d98f4f]"
            />
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addOrder()}
              placeholder="السعر"
              className="w-24 px-3 py-2.5 rounded-lg border border-[#3d2e22] bg-[#1b1410] text-[#f3e9da] text-sm outline-none focus:border-[#d98f4f]"
            />
            <button
              onClick={addOrder}
              className="px-5 py-2.5 rounded-lg bg-[#c97a3a] text-[#1b1410] text-sm font-bold"
            >
              إضافة
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {sortedOrders.length === 0 && (
            <div className="text-center text-sm text-[#b8a48d] py-10">
              لسه مفيش طلبات في الورقة دي — ضيف أول طلب من فوق
            </div>
          )}
          {sortedOrders.map((o) => {
            const { date, time } = timeLabel(o.ts);
            return (
              <div
                key={o.id}
                className={`animate-pop flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 rounded-lg border p-3 ${
                  o.paid
                    ? "bg-[#1e2a1f] border-[#33422f]"
                    : "bg-[#241a14] border-[#3d2e22]"
                }`}
              >
                <div className="order-3 sm:order-none text-[11px] text-[#8a7864] leading-tight w-full sm:w-14 shrink-0">
                  {date}
                  <br />
                  {time}
                </div>

                <div className="flex-1 min-w-0 flex flex-wrap gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-md border text-base sm:text-lg font-bold ${
                      o.paid
                        ? "line-through text-[#7d8f78] border-[#33422f] bg-[#1a2419]"
                        : "text-[#f3e9da] border-[#4a382a] bg-[#2c2019]"
                    }`}
                  >
                    {o.name}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md border text-sm ${
                      o.paid
                        ? "line-through text-[#7d8f78] border-[#33422f] bg-[#1a2419]"
                        : "text-[#d9b58c] border-[#4a382a] bg-[#2c2019]"
                    }`}
                  >
                    ☕ {o.drink}
                  </span>
                </div>

                <div
                  className={`font-extrabold text-sm shrink-0 ${o.paid ? "text-[#8fbf7a]" : "text-[#e2685a]"}`}
                >
                  {fmt(o.price)}
                </div>
                <button
                  onClick={() => togglePaid(o.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                    o.paid
                      ? "border-[#8fbf7a] bg-[#1e2a1f] text-[#8fbf7a]"
                      : "border-[#e2685a] bg-[#3a221e] text-[#e2685a]"
                  }`}
                >
                  {o.paid ? "اتحاسب ✓" : "حاسبني"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
