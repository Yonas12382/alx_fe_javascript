let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { id: 3, text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categorySelect = document.getElementById("categorySelect");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  let selectedCategory = categoryFilter.value;
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available in this category.</em>";
    return;
  }
  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— [${quote.category}]</small>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  let newText = document.getElementById("newQuoteText").value.trim();
  let newCategory = document.getElementById("newQuoteCategory").value.trim();
  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }
  let newQuote = { id: Date.now(), text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  postQuoteToServer(newQuote);
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

function populateCategories() {
  let categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    let option1 = document.createElement("option");
    option1.value = cat;
    option1.textContent = cat;
    categorySelect.appendChild(option1);
    let option2 = document.createElement("option");
    option2.value = cat;
    option2.textContent = cat;
    categoryFilter.appendChild(option2);
  });
  let savedFilter = localStorage.getItem("selectedFilter");
  if (savedFilter) categoryFilter.value = savedFilter;
}

function filterQuotes() {
  localStorage.setItem("selectedFilter", categoryFilter.value);
  showRandomQuote();
}

async function fetchQuotesFromServer() {
  try {
    let res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    let data = await res.json();
    return data.map(item => ({ id: item.id, text: item.title, category: "Server" }));
  } catch {
    showSyncMessage("Failed to fetch quotes from server.");
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" }
    });
    showSyncMessage("Quote synced to server.");
  } catch {
    showSyncMessage("Failed to sync quote to server.");
  }
}

async function syncQuotes() {
  let serverQuotes = await fetchQuotesFromServer();
  let newQuotes = serverQuotes.filter(sq => !quotes.some(lq => lq.id === sq.id));
  if (newQuotes.length > 0) {
    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();
    showSyncMessage("Quotes synced with server!");
  }
}

function showSyncMessage(msg) {
  syncStatus.textContent = msg;
  syncStatus.style.display = "block";
  setTimeout(() => syncStatus.style.display = "none", 4000);
}

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

populateCategories();
let lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  let quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— [${quote.category}]</small>`;
} else {
  showRandomQuote();
}

setInterval(syncQuotes, 30000);
