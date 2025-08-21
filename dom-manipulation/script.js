let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categorySelect = document.getElementById("categorySelect");
const categoryFilter = document.getElementById("categoryFilter");

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
  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  populateCategories();
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
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

function filterQuotes() {
  localStorage.setItem("selectedFilter", categoryFilter.value);
  showRandomQuote();
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
