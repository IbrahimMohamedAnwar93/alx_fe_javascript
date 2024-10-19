// Quotes array - Initialize empty or load from local storage
let quotes = [];

// Simulated server URL (replace with actual server URL if needed)
const SERVER_URL = "https://jsonplaceholder.typicode.com/quotes";

// Load existing quotes from local storage on page load
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes(); // Save to local storage
    sendQuoteToServer(newQuote); // Sync with server
    populateCategories(); // Update categories dropdown
    alert("New quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    filterQuotes(); // Refresh the displayed quotes
  } else {
    alert("Please fill out both fields.");
  }
}

// Populate categories dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map((quote) => quote.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteList = document.getElementById("quoteList");
  quoteList.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  filteredQuotes.forEach((quote) => {
    const li = document.createElement("li");
    li.textContent = `${quote.text} - ${quote.category}`;
    quoteList.appendChild(li);
  });

  // Save the selected category to local storage
  localStorage.setItem("selectedCategory", selectedCategory);
}

// Remember the last selected category filter across sessions
function restoreCategoryFilter() {
  const selectedCategory = localStorage.getItem("selectedCategory");
  if (selectedCategory) {
    document.getElementById("categoryFilter").value = selectedCategory;
  }
  filterQuotes(); // Refresh the quotes display
}

// Function to export quotes as JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = url;
  downloadAnchor.download = "quotes.json";
  downloadAnchor.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Fetch data from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    // Resolve conflicts: server's data takes precedence (LWW)
    if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
      quotes = serverQuotes;
      saveQuotes();
      alert("Quotes updated from server!");
    }
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Send a new quote to the server
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    const result = await response.json();
    console.log("Quote successfully sent to server:", result);
  } catch (error) {
    console.error("Error sending quote to server:", error);
  }
}

// Resolve conflicts: server data takes precedence (LWW strategy)
function resolveConflicts(localQuote, serverQuote) {
  return JSON.stringify(localQuote) !== JSON.stringify(serverQuote)
    ? serverQuote
    : localQuote;
}

// Periodically sync with the server every 10 minutes
setInterval(fetchQuotesFromServer, 600000);

// Load quotes and restore category filter on page load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreCategoryFilter();
});

// Event listeners for quote addition and category filtering
document.getElementById("addQuoteButton").addEventListener("click", addQuote);
document
  .getElementById("categoryFilter")
  .addEventListener("change", filterQuotes);
document
  .getElementById("exportButton")
  .addEventListener("click", exportToJsonFile);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      title: newQuoteText,
      body: newQuoteText,
      category: newQuoteCategory,
    }; // Adjusted for posts
    quotes.push(newQuote);
    saveQuotes(); // Save to local storage
    sendQuoteToServer(newQuote); // Sync with server
    populateCategories(); // Update categories dropdown
    alert("New quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    filterQuotes(); // Refresh the displayed quotes
  } else {
    alert("Please fill out both fields.");
  }
}

async function sendQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: quote.text, body: quote.text }), // Adjusted for posts
    });
    const result = await response.json();
    console.log("Quote successfully sent to server:", result);
  } catch (error) {
    console.error("Error sending quote to server:", error);
  }
}
