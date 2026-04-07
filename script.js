// ══════════════════════════════════════════════
//  CURRENCY SYSTEM
// ══════════════════════════════════════════════

const CURRENCIES = [
  { code:"INR",  symbol:"₹",  locale:"en-IN",  name:"Indian Rupee",       flag:"🇮🇳" },
  { code:"USD",  symbol:"$",  locale:"en-US",  name:"US Dollar",           flag:"🇺🇸" },
  { code:"EUR",  symbol:"€",  locale:"de-DE",  name:"Euro",                flag:"🇪🇺" },
  { code:"GBP",  symbol:"£",  locale:"en-GB",  name:"British Pound",       flag:"🇬🇧" },
  { code:"JPY",  symbol:"¥",  locale:"ja-JP",  name:"Japanese Yen",        flag:"🇯🇵" },
  { code:"CNY",  symbol:"¥",  locale:"zh-CN",  name:"Chinese Yuan",        flag:"🇨🇳" },
  { code:"AUD",  symbol:"A$", locale:"en-AU",  name:"Australian Dollar",   flag:"🇦🇺" },
  { code:"CAD",  symbol:"C$", locale:"en-CA",  name:"Canadian Dollar",     flag:"🇨🇦" },
  { code:"CHF",  symbol:"Fr", locale:"de-CH",  name:"Swiss Franc",         flag:"🇨🇭" },
  { code:"SGD",  symbol:"S$", locale:"en-SG",  name:"Singapore Dollar",    flag:"🇸🇬" },
  { code:"AED",  symbol:"د.إ",locale:"ar-AE",  name:"UAE Dirham",          flag:"🇦🇪" },
  { code:"SAR",  symbol:"﷼",  locale:"ar-SA",  name:"Saudi Riyal",         flag:"🇸🇦" },
  { code:"MYR",  symbol:"RM", locale:"ms-MY",  name:"Malaysian Ringgit",   flag:"🇲🇾" },
  { code:"IDR",  symbol:"Rp", locale:"id-ID",  name:"Indonesian Rupiah",   flag:"🇮🇩" },
  { code:"THB",  symbol:"฿",  locale:"th-TH",  name:"Thai Baht",           flag:"🇹🇭" },
  { code:"PHP",  symbol:"₱",  locale:"en-PH",  name:"Philippine Peso",     flag:"🇵🇭" },
  { code:"KRW",  symbol:"₩",  locale:"ko-KR",  name:"South Korean Won",    flag:"🇰🇷" },
  { code:"BRL",  symbol:"R$", locale:"pt-BR",  name:"Brazilian Real",      flag:"🇧🇷" },
  { code:"MXN",  symbol:"$",  locale:"es-MX",  name:"Mexican Peso",        flag:"🇲🇽" },
  { code:"ZAR",  symbol:"R",  locale:"en-ZA",  name:"South African Rand",  flag:"🇿🇦" },
  { code:"NGN",  symbol:"₦",  locale:"en-NG",  name:"Nigerian Naira",      flag:"🇳🇬" },
  { code:"EGP",  symbol:"£",  locale:"ar-EG",  name:"Egyptian Pound",      flag:"🇪🇬" },
  { code:"PKR",  symbol:"₨",  locale:"ur-PK",  name:"Pakistani Rupee",     flag:"🇵🇰" },
  { code:"BDT",  symbol:"৳",  locale:"bn-BD",  name:"Bangladeshi Taka",    flag:"🇧🇩" },
  { code:"NPR",  symbol:"Rs", locale:"ne-NP",  name:"Nepali Rupee",        flag:"🇳🇵" },
  { code:"LKR",  symbol:"Rs", locale:"si-LK",  name:"Sri Lankan Rupee",    flag:"🇱🇰" },
  { code:"SEK",  symbol:"kr", locale:"sv-SE",  name:"Swedish Krona",       flag:"🇸🇪" },
  { code:"NOK",  symbol:"kr", locale:"nb-NO",  name:"Norwegian Krone",     flag:"🇳🇴" },
  { code:"DKK",  symbol:"kr", locale:"da-DK",  name:"Danish Krone",        flag:"🇩🇰" },
  { code:"NZD",  symbol:"NZ$",locale:"en-NZ",  name:"New Zealand Dollar",  flag:"🇳🇿" },
];

// Locale → currency code map for auto-detection
const LOCALE_TO_CURRENCY = {
  "en-IN":"INR","hi-IN":"INR","en-US":"USD","en-GB":"GBP","de-DE":"EUR",
  "fr-FR":"EUR","es-ES":"EUR","it-IT":"EUR","pt-PT":"EUR","nl-NL":"EUR",
  "ja-JP":"JPY","zh-CN":"CNY","zh-TW":"TWD","ko-KR":"KRW","en-AU":"AUD",
  "en-CA":"CAD","de-CH":"CHF","fr-CH":"CHF","en-SG":"SGD","ar-AE":"AED",
  "ar-SA":"SAR","ms-MY":"MYR","id-ID":"IDR","th-TH":"THB","en-PH":"PHP",
  "pt-BR":"BRL","es-MX":"MXN","en-ZA":"ZAR","en-NG":"NGN","ar-EG":"EGP",
  "ur-PK":"PKR","bn-BD":"BDT","ne-NP":"NPR","si-LK":"LKR","sv-SE":"SEK",
  "nb-NO":"NOK","da-DK":"DKK","en-NZ":"NZD",
};

function detectCurrency() {
  const lang = navigator.language || "";
  // Try exact match first, then 5-char, then 2-char prefix match
  const detected = LOCALE_TO_CURRENCY[lang]
    || LOCALE_TO_CURRENCY[lang.slice(0,5)]
    || LOCALE_TO_CURRENCY[Object.keys(LOCALE_TO_CURRENCY).find(k => k.startsWith(lang.slice(0,2))) || ""];
  // Only return detected if we're confident, otherwise default to INR
  return detected || "INR";
}

let activeCurrencyCode = localStorage.getItem("ft_currency") || "INR";
let autoDetected       = false;

function getCurrency() {
  return CURRENCIES.find(c => c.code === activeCurrencyCode) || CURRENCIES[1];
}

// Format a number using Intl — correct symbol placement & decimal rules per locale
function fmt(n) {
  const c = getCurrency();
  try {
    return new Intl.NumberFormat(c.locale, {
      style: "currency",
      currency: c.code,
      maximumFractionDigits: ["JPY","KRW","IDR"].includes(c.code) ? 0 : 0,
    }).format(n);
  } catch {
    return `${c.symbol}${Math.round(n).toLocaleString()}`;
  }
}

// Just the symbol, no number (used in small UI spots)
function sym() { return getCurrency().symbol; }

// ══════════════════════════════════════════════
//  ELEMENTS
// ══════════════════════════════════════════════
const balanceEl    = document.getElementById("balance");
const incomeEl     = document.getElementById("income");
const expenseEl    = document.getElementById("expense");
const savingsEl    = document.getElementById("savingsRate");
const listEl       = document.getElementById("transactionList");
const form         = document.getElementById("transactionForm");
const themeToggle  = document.getElementById("themeToggle");
const searchInput  = document.getElementById("searchInput");
const monthFilter  = document.getElementById("monthFilter");
const balanceBar   = document.getElementById("balanceBar");
const budgetListEl = document.getElementById("budgetList");
const emptyState   = document.getElementById("emptyState");
const noChartData  = document.getElementById("noChartData");
const toastEl      = document.getElementById("toast");
const brandIcon    = document.getElementById("brandIcon");
const amountPrefix = document.getElementById("amountPrefix");

// ── State ──
let transactions     = JSON.parse(localStorage.getItem("ft_transactions")) || [];
let budgets          = JSON.parse(localStorage.getItem("ft_budgets"))      || {};
let darkMode         = localStorage.getItem("ft_dark") === "true";
let currentChartType = "doughnut";
let rLineChart, rDonutChart, rBarChart;

// ── Theme init ──
if (darkMode) { document.body.classList.add("dark"); themeToggle.textContent = "☀️"; }

// ── Category icons ──
const icons = {
  "Food & Dining":"🍔","Transport":"🚗","Shopping":"🛍️","Entertainment":"🎬",
  "Health":"💊","Bills & Utilities":"⚡","Education":"📚","Salary":"💼",
  "Freelance":"💻","Investment":"📈","Other":"📦"
};
const getIcon = cat => icons[cat] || "💰";
const COLORS  = ["#6366f1","#10b981","#f43f5e","#f59e0b","#06b6d4","#8b5cf6","#ec4899","#14b8a6","#84cc16","#fb923c"];

// ── Main chart ctx ──
const ctx = document.getElementById("expenseChart").getContext("2d");
let chart;

// ══════════════════════════════════════════════
//  CURRENCY MODAL
// ══════════════════════════════════════════════
document.getElementById("currencyBtn").addEventListener("click", openCurrencyModal);

function openCurrencyModal() {
  document.getElementById("currencyModal").style.display = "flex";
  document.body.style.overflow = "hidden";
  const c = getCurrency();
  document.getElementById("currentCurrencyLabel").textContent =
    `Current: ${c.flag} ${c.name}`;
  renderCurrencyGrid("");
  document.getElementById("currencySearch").value = "";
  document.getElementById("currencySearch").focus();
}

function closeCurrencyModal() {
  document.getElementById("currencyModal").style.display = "none";
  document.body.style.overflow = "";
}

function currencyOverlayClose(e) {
  if (e.target === document.getElementById("currencyModal")) closeCurrencyModal();
}

document.getElementById("currencySearch").addEventListener("input", e => {
  renderCurrencyGrid(e.target.value.toLowerCase());
});

function renderCurrencyGrid(query) {
  const grid = document.getElementById("currencyGrid");
  const list = query
    ? CURRENCIES.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.symbol.includes(query))
    : CURRENCIES;

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--muted)">No currencies found</div>`;
    return;
  }

  grid.innerHTML = list.map(c => `
    <div class="currency-item ${c.code === activeCurrencyCode ? "active" : ""}"
         onclick="selectCurrency('${c.code}')">
      <span class="currency-flag">${c.flag}</span>
      <div class="currency-info">
        <div class="currency-code">${c.code}</div>
        <div class="currency-name">${c.name}</div>
        <div class="currency-symbol">${c.symbol}</div>
      </div>
    </div>`).join("");
}

function selectCurrency(code) {
  activeCurrencyCode = code;
  autoDetected = false;
  localStorage.setItem("ft_currency", code);
  closeCurrencyModal();
  updateCurrencyUI();
  render();
  showToast(`Currency set to ${getCurrency().flag} ${getCurrency().code}`);
}

function updateCurrencyUI() {
  const c = getCurrency();
  brandIcon.textContent   = c.symbol;
  amountPrefix.textContent = c.symbol;
}

// ══════════════════════════════════════════════
//  TRANSACTIONS
// ══════════════════════════════════════════════
form.addEventListener("submit", e => {
  e.preventDefault();
  const text     = document.getElementById("text").value.trim();
  const amount   = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value || "Other";
  const note     = document.getElementById("note").value.trim();
  const dateVal  = document.getElementById("date").value;
  if (!text || isNaN(amount)) return;
  transactions.unshift({ id:Date.now(), text, amount, category, note, date: dateVal || today() });
  save(); render(); form.reset();
  document.getElementById("date").value = today();
  showToast(`${amount > 0 ? "Income" : "Expense"} added ✓`);
});

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save(); render();
  showToast("Transaction deleted");
}

document.getElementById("clearBtn").addEventListener("click", () => {
  if (!transactions.length) return showToast("Nothing to clear");
  if (!confirm("Delete all transactions?")) return;
  transactions = []; save(); render();
  showToast("All cleared");
});

// ── Budget ──
function setBudget() {
  const cat = document.getElementById("budgetCategory").value;
  const amt = parseFloat(document.getElementById("budgetAmount").value);
  if (!cat || isNaN(amt) || amt <= 0) return showToast("Pick a category & valid amount");
  budgets[cat] = amt;
  saveBudgets(); render();
  document.getElementById("budgetCategory").value = "";
  document.getElementById("budgetAmount").value   = "";
  showToast(`Budget set: ${cat} → ${fmt(amt)}`);
}

function removeBudget(cat) {
  delete budgets[cat];
  saveBudgets(); render();
  showToast(`Budget removed: ${cat}`);
}

// ── Export CSV ──
document.getElementById("exportBtn").addEventListener("click", () => {
  if (!transactions.length) return showToast("No transactions to export");
  const rows = transactions.map(t =>
    [t.date, `"${t.text}"`, `"${t.category}"`, t.amount, getCurrency().code, `"${t.note || ""}"`].join(",")
  );
  download(["Date,Description,Category,Amount,Currency,Note", ...rows].join("\n"),
    `fintrack_${today()}.csv`, "text/csv");
  showToast("CSV exported ✓");
});

// ── Filters ──
searchInput.addEventListener("input", render);
monthFilter.addEventListener("change", render);

function switchChart(type, btn) {
  currentChartType = type;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  render();
}

// ══════════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════════
function render() {
  const searchQ = searchInput.value.toLowerCase();
  const monthQ  = monthFilter.value;

  let income = 0, expenseTotal = 0, categoryTotals = {};
  transactions.forEach(t => {
    if (t.amount > 0) income += t.amount;
    else expenseTotal += Math.abs(t.amount);
    if (t.amount < 0) categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
  });

  const balance = income - expenseTotal;
  balanceEl.textContent  = fmt(balance);
  incomeEl.textContent   = fmt(income);
  expenseEl.textContent  = fmt(expenseTotal);
  savingsEl.textContent  = income > 0 ? `${Math.max(0,((balance/income)*100).toFixed(0))}%` : "0%";
  balanceEl.style.color  = balance >= 0 ? "var(--income)" : "var(--expense)";
  balanceBar.style.width = income > 0 ? `${Math.min(100,(balance/income)*100)}%` : "0%";

  const filtered = transactions.filter(t => {
    const s = t.text.toLowerCase().includes(searchQ) ||
              t.category.toLowerCase().includes(searchQ) ||
              (t.note||"").toLowerCase().includes(searchQ);
    const m = !monthQ || t.date.startsWith(monthQ);
    return s && m;
  });

  listEl.innerHTML = "";
  emptyState.style.display = filtered.length ? "none" : "block";

  filtered.forEach(t => {
    const isInc = t.amount > 0;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="tx-icon ${isInc?"income":"expense"}">${getIcon(t.category)}</div>
      <div class="tx-info">
        <div class="tx-name" title="${t.text}">${t.text}</div>
        <div class="tx-meta">${t.category}${t.note?" · "+t.note:""}</div>
      </div>
      <div class="tx-right">
        <div class="tx-amount ${isInc?"income":"expense"}">${isInc?"+":"−"}${fmt(Math.abs(t.amount))}</div>
        <div class="tx-date">${formatDate(t.date)}</div>
      </div>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>`;
    listEl.appendChild(li);
  });

  updateMainChart(categoryTotals);
  renderBudgets(categoryTotals);
}

// ── Main chart ──
function updateMainChart(data) {
  const labels = Object.keys(data), values = Object.values(data);
  if (chart) chart.destroy();
  if (!labels.length) { noChartData.style.display="block"; return; }
  noChartData.style.display = "none";
  const isDark    = document.body.classList.contains("dark");
  const textColor = isDark ? "#e8edf5" : "#0d1117";
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  if (currentChartType === "doughnut") {
    chart = new Chart(ctx, {
      type:"doughnut",
      data:{ labels, datasets:[{ data:values, backgroundColor:COLORS, borderWidth:2, borderColor:"transparent" }] },
      options:{ responsive:true, cutout:"65%",
        plugins:{ legend:{ labels:{ color:textColor, font:{family:"Sora",size:12}, padding:16 } },
          tooltip:{ callbacks:{ label:c=>` ${fmt(c.parsed)} (${((c.parsed/values.reduce((a,b)=>a+b,0))*100).toFixed(1)}%)` } } } }
    });
  } else {
    chart = new Chart(ctx, {
      type:"bar",
      data:{ labels, datasets:[{ label:"Expenses", data:values, backgroundColor:COLORS, borderRadius:8, borderSkipped:false }] },
      options:{ responsive:true,
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:c=>` ${fmt(c.parsed.y)}` } } },
        scales:{ x:{ ticks:{color:textColor,font:{family:"Sora"}}, grid:{color:gridColor} },
                 y:{ ticks:{color:textColor,font:{family:"Sora"},callback:v=>fmt(v)}, grid:{color:gridColor} } } }
    });
  }
}

// ── Budget render ──
function renderBudgets(categoryTotals) {
  const entries = Object.entries(budgets);
  if (!entries.length) { budgetListEl.innerHTML = ""; return; }
  budgetListEl.innerHTML = entries.map(([cat, limit]) => {
    const spent  = categoryTotals[cat] || 0;
    const pct    = Math.min(100, (spent/limit)*100);
    const status = spent >= limit ? "over" : pct >= 80 ? "near" : "ok";
    const label  = status==="over" ? "⚠ Over budget" : status==="near" ? "⚡ Almost there" : "✓ On track";
    const color  = status==="over" ? "var(--expense)" : status==="near" ? "var(--warning)" : "var(--income)";
    return `
      <div class="budget-item ${status}">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:600;font-size:.82rem">${getIcon(cat)} ${cat}</span>
            <button class="budget-remove" onclick="removeBudget('${cat}')" title="Remove budget">✕</button>
          </div>
          <div class="budget-bar-wrap">
            <div class="budget-bar" style="width:${pct}%;background:${color}"></div>
          </div>
        </div>
        <div style="text-align:right;font-size:.78rem;margin-left:10px;flex-shrink:0">
          <div>${fmt(spent)} / ${fmt(limit)}</div>
          <div style="margin-top:2px">${label}</div>
        </div>
      </div>`;
  }).join("");
}

// ══════════════════════════════════════════════
//  FINANCIAL REPORT
// ══════════════════════════════════════════════
document.getElementById("reportBtn").addEventListener("click", openReport);

function openReport() {
  if (!transactions.length) return showToast("Add transactions first");
  buildReport();
  document.getElementById("reportModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeReport() {
  document.getElementById("reportModal").style.display = "none";
  document.body.style.overflow = "";
  [rLineChart, rDonutChart, rBarChart].forEach(c => { if(c) c.destroy(); });
  rLineChart = rDonutChart = rBarChart = null;
}

function overlayClose(e) {
  if (e.target === document.getElementById("reportModal")) closeReport();
}

function buildReport() {
  const isDark    = document.body.classList.contains("dark");
  const textColor = isDark ? "#e8edf5" : "#0d1117";
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  let totalIncome = 0, totalExpense = 0, catTotals = {}, monthMap = {};
  transactions.forEach(t => {
    const mo = t.date ? t.date.slice(0,7) : "Unknown";
    if (!monthMap[mo]) monthMap[mo] = { income:0, expense:0 };
    if (t.amount > 0) { totalIncome += t.amount; monthMap[mo].income += t.amount; }
    else { totalExpense += Math.abs(t.amount); monthMap[mo].expense += Math.abs(t.amount); }
    if (t.amount < 0) catTotals[t.category] = (catTotals[t.category]||0) + Math.abs(t.amount);
  });

  const balance    = totalIncome - totalExpense;
  const savings    = totalIncome > 0 ? ((balance/totalIncome)*100).toFixed(1) : 0;
  const avgMonthly = Object.keys(monthMap).length ? (totalExpense/Object.keys(monthMap).length) : 0;
  const months     = Object.keys(monthMap).sort();
  const c          = getCurrency();

  document.getElementById("reportPeriod").textContent =
    months.length ? `${formatMonth(months[0])} – ${formatMonth(months[months.length-1])} · ${transactions.length} transactions · ${c.flag} ${c.code}` : "";

  document.getElementById("reportSummary").innerHTML = [
    { label:"Total Income",    value:fmt(totalIncome),             color:"var(--income)" },
    { label:"Total Expenses",  value:fmt(totalExpense),            color:"var(--expense)" },
    { label:"Net Balance",     value:fmt(balance),                 color: balance>=0?"var(--income)":"var(--expense)" },
    { label:"Savings Rate",    value:`${Math.max(0,savings)}%`,    color:"var(--primary)" },
    { label:"Avg Monthly Exp", value:fmt(avgMonthly),              color:"var(--muted)" },
    { label:"Transactions",    value:transactions.length,          color:"var(--text)" },
  ].map(s=>`<div class="rs-card"><div class="rs-label">${s.label}</div><div class="rs-value" style="color:${s.color}">${s.value}</div></div>`).join("");

  [rLineChart, rDonutChart, rBarChart].forEach(c => { if(c) c.destroy(); });
  const chartDefaults = { responsive:true, maintainAspectRatio:false };

  // Line chart
  const lineCtx = document.getElementById("rLineChart").getContext("2d");
  document.getElementById("rLineChart").style.height = "180px";
  rLineChart = new Chart(lineCtx, {
    type:"line",
    data:{ labels:months.map(formatMonth),
      datasets:[
        { label:"Income",   data:months.map(m=>monthMap[m].income),  borderColor:"#10b981", backgroundColor:"rgba(16,185,129,.12)", tension:.4, fill:true, pointRadius:4, pointBackgroundColor:"#10b981" },
        { label:"Expenses", data:months.map(m=>monthMap[m].expense), borderColor:"#f43f5e", backgroundColor:"rgba(244,63,94,.12)",  tension:.4, fill:true, pointRadius:4, pointBackgroundColor:"#f43f5e" }
      ]},
    options:{ ...chartDefaults,
      plugins:{ legend:{ labels:{ color:textColor, font:{family:"Sora",size:11} } }, tooltip:{ callbacks:{ label:c=>` ${fmt(c.parsed.y)}` } } },
      scales:{ x:{ ticks:{color:textColor,font:{family:"Sora",size:10}}, grid:{color:gridColor} },
               y:{ ticks:{color:textColor,font:{family:"Sora",size:10},callback:v=>fmt(v)}, grid:{color:gridColor} } } }
  });

  // Doughnut
  const dCtx = document.getElementById("rDonutChart").getContext("2d");
  document.getElementById("rDonutChart").style.height = "180px";
  const catLabels = Object.keys(catTotals), catValues = Object.values(catTotals);
  rDonutChart = new Chart(dCtx, {
    type:"doughnut",
    data:{ labels:catLabels, datasets:[{ data:catValues, backgroundColor:COLORS, borderWidth:2, borderColor:"transparent" }] },
    options:{ ...chartDefaults, cutout:"60%",
      plugins:{ legend:{ position:"bottom", labels:{ color:textColor, font:{family:"Sora",size:10}, padding:10, boxWidth:10 } },
        tooltip:{ callbacks:{ label:c=>` ${fmt(c.parsed)} (${((c.parsed/(catValues.reduce((a,b)=>a+b,0)||1))*100).toFixed(1)}%)` } } } }
  });

  // Bar net balance
  const bCtx = document.getElementById("rBarChart").getContext("2d");
  document.getElementById("rBarChart").style.height = "180px";
  const netValues = months.map(m => monthMap[m].income - monthMap[m].expense);
  rBarChart = new Chart(bCtx, {
    type:"bar",
    data:{ labels:months.map(formatMonth),
      datasets:[{ label:"Net", data:netValues,
        backgroundColor:netValues.map(v=>v>=0?"rgba(16,185,129,.75)":"rgba(244,63,94,.75)"),
        borderRadius:6, borderSkipped:false }] },
    options:{ ...chartDefaults,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:c=>` ${fmt(c.parsed.y)}` } } },
      scales:{ x:{ ticks:{color:textColor,font:{family:"Sora",size:10}}, grid:{color:gridColor} },
               y:{ ticks:{color:textColor,font:{family:"Sora",size:10},callback:v=>fmt(v)}, grid:{color:gridColor} } } }
  });

  // Category table
  const sortedCats = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
  document.getElementById("reportCatTable").innerHTML = sortedCats.length ? `
    <table class="r-table">
      <thead><tr><th>Category</th><th>Spent</th><th>% of Expenses</th><th>Transactions</th></tr></thead>
      <tbody>${sortedCats.map(([cat,amt]) => {
        const count = transactions.filter(t=>t.category===cat&&t.amount<0).length;
        const pct   = totalExpense > 0 ? ((amt/totalExpense)*100).toFixed(1) : 0;
        return `<tr>
          <td>${getIcon(cat)} ${cat}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-weight:600">${fmt(amt)}</td>
          <td><div style="display:flex;align-items:center;gap:8px">
            <div style="flex:1;height:6px;background:var(--border);border-radius:99px;overflow:hidden">
              <div style="width:${Math.min(100,parseFloat(pct))}%;height:100%;background:var(--primary);border-radius:99px"></div>
            </div>
            <span style="font-size:.78rem;color:var(--muted);width:36px">${pct}%</span>
          </div></td>
          <td style="color:var(--muted)">${count}</td>
        </tr>`;
      }).join("")}</tbody>
    </table>` : `<div class="empty-state">No expense data</div>`;

  // Top 5 expenses
  const top5Exp = [...transactions].filter(t=>t.amount<0).sort((a,b)=>a.amount-b.amount).slice(0,5);
  document.getElementById("reportTopExp").innerHTML = top5Exp.length
    ? top5Exp.map((t,i)=>`
      <div class="top-tx-item">
        <div class="top-tx-rank">${i+1}</div>
        <div class="tx-icon expense" style="width:30px;height:30px;font-size:.85rem">${getIcon(t.category)}</div>
        <div class="top-tx-info"><div class="top-tx-name">${t.text}</div><div class="top-tx-cat">${t.category} · ${formatDate(t.date)}</div></div>
        <div class="top-tx-amt expense-text">−${fmt(Math.abs(t.amount))}</div>
      </div>`).join("")
    : `<div class="empty-state">No expenses</div>`;

  // Top 5 income
  const top5Inc = [...transactions].filter(t=>t.amount>0).sort((a,b)=>b.amount-a.amount).slice(0,5);
  document.getElementById("reportTopInc").innerHTML = top5Inc.length
    ? top5Inc.map((t,i)=>`
      <div class="top-tx-item">
        <div class="top-tx-rank" style="background:var(--income-bg);color:var(--income)">${i+1}</div>
        <div class="tx-icon income" style="width:30px;height:30px;font-size:.85rem">${getIcon(t.category)}</div>
        <div class="top-tx-info"><div class="top-tx-name">${t.text}</div><div class="top-tx-cat">${t.category} · ${formatDate(t.date)}</div></div>
        <div class="top-tx-amt income-text">+${fmt(t.amount)}</div>
      </div>`).join("")
    : `<div class="empty-state">No income records</div>`;

  // Month table
  document.getElementById("reportMonthTable").innerHTML = `
    <table class="r-table">
      <thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Net</th><th>Savings %</th></tr></thead>
      <tbody>${months.slice().reverse().map(mo => {
        const { income:inc, expense:exp } = monthMap[mo];
        const net = inc - exp;
        const sv  = inc > 0 ? ((net/inc)*100).toFixed(0) : "—";
        return `<tr>
          <td style="font-weight:600">${formatMonth(mo)}</td>
          <td class="income-text"  style="font-family:'JetBrains Mono',monospace">+${fmt(inc)}</td>
          <td class="expense-text" style="font-family:'JetBrains Mono',monospace">−${fmt(exp)}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${net>=0?"var(--income)":"var(--expense)"}">
            ${net>=0?"+":""}${fmt(net)}</td>
          <td><span class="pill ${sv==="—"?"":"income"}">${sv==="—"?"—":sv+"%"}</span></td>
        </tr>`;
      }).join("")}</tbody>
    </table>`;
}

function exportReport() { window.print(); }

// ── Theme ──
themeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
  themeToggle.textContent = darkMode ? "☀️" : "🌙";
  localStorage.setItem("ft_dark", darkMode);
  render();
});

// ── Helpers ──
function save()        { localStorage.setItem("ft_transactions", JSON.stringify(transactions)); }
function saveBudgets() { localStorage.setItem("ft_budgets",      JSON.stringify(budgets)); }
function today()       { return new Date().toISOString().split("T")[0]; }

function formatDate(str) {
  if (!str) return "";
  return new Date(str + "T00:00:00").toLocaleDateString(getCurrency().locale, { day:"2-digit", month:"short", year:"2-digit" });
}

function formatMonth(str) {
  if (!str || str === "Unknown") return str;
  const [y, m] = str.split("-");
  return new Date(y, m-1).toLocaleDateString(getCurrency().locale, { month:"short", year:"numeric" });
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

function download(content, filename, type) {
  const a = document.createElement("a");
  a.href  = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
}

// ── Init ──
document.getElementById("date").value = today();
updateCurrencyUI();
render();
