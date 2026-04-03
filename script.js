const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const listEl = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const themeToggle = document.getElementById("themeToggle");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const ctx = document.getElementById("expenseChart").getContext("2d");
let chart;

// Add transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const amount = +document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  const transaction = {
    id: Date.now(),
    text,
    amount,
    category
  };

  transactions.push(transaction);
  updateLocalStorage();
  render();
  form.reset();
});

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  render();
}

// Update UI
function render() {
  listEl.innerHTML = "";

  let income = 0;
  let expense = 0;
  let categoryTotals = {};

  transactions.forEach(t => {
    if (t.amount > 0) income += t.amount;
    else expense += t.amount;

    if (t.amount < 0) {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    }

    const li = document.createElement("li");
    li.innerHTML = `
      ${t.text} (${t.category}) - ₹${t.amount}
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">x</button>
    `;
    listEl.appendChild(li);
  });

  balanceEl.textContent = `₹${income + expense}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${Math.abs(expense)}`;

  updateChart(categoryTotals);
}

// Update chart
function updateChart(data) {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: [
          "#6366f1",
          "#16a34a",
          "#dc2626",
          "#f59e0b",
          "#06b6d4"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body).getPropertyValue('--text')
          }
        }
      }
    }
  });
}

// LocalStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
  render();
});

// Initial render
render();