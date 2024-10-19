// Quotes array - Initialized empty
const quotes = [];

// Simulated server endpoint (replace with actual API endpoint if needed)
const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Example endpoint

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes.push(...JSON.parse(storedQuotes)); // Load quotes from local storage
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = new Set(quotes.map((quote) => quote.category));

  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Default option
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category filter from local storage
  const lastSelectedCategory = localStorage.getItem("selectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes(); // Apply the filter immediately
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous quotes

  filteredQuotes.forEach((quote) => {
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("small");
    quoteCategory.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  });

  // Save the selected category filter to local storage
  localStorage.setItem("selectedCategory", selectedCategory);
}

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Save the current quote to session storage
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    const quoteText = document.createElement("p");
    quoteText.textContent = `"${randomQuote.text}"`;

    const quoteCategory = document.createElement("small");
    quoteCategory.textContent = `Category: ${randomQuote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  } else {
    document.getElementById("quoteDisplay").textContent =
      "No quotes available.";
  }
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save to local storage
    populateCategories(); // Update categories in the dropdown
    alert("New quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    filterQuotes(); // Refresh the displayed quotes based on the selected category
  } else {
    alert("Please fill out both fields.");
  }
}

// Function to export quotes as JSON file
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url); // Clean up
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    if (Array.isArray(importedQuotes)) {
      quotes.push(...importedQuotes);
      saveQuotes(); // Save imported quotes to local storage
      populateCategories(); // Update the category dropdown with new categories
      alert("Quotes imported successfully!");
      filterQuotes(); // Refresh the displayed quotes after importing
    } else {
      alert("Invalid file format!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    // Map the response to your quote structure
    const newQuotes = data.map((item) => ({
      text: item.title, // Use title as quote text for simplicity
      category: "general", // Use a default category
    }));

    // Sync new quotes with local storage
    syncQuotesWithLocal(newQuotes);
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
  }
}

// Function to sync quotes with local storage
function syncQuotesWithLocal(newQuotes) {
  let hasConflict = false;

  newQuotes.forEach((newQuote) => {
    const exists = quotes.find((quote) => quote.text === newQuote.text);
    if (!exists) {
      quotes.push(newQuote);
    } else {
      // Conflict resolution: simply keep the server's data
      hasConflict = true;
      const index = quotes.indexOf(exists);
      quotes[index] = newQuote;
    }
  });

  saveQuotes(); // Save the updated quotes to local storage
  filterQuotes(); // Refresh the displayed quotes

  if (hasConflict) {
    showNotification("Quotes were updated from the server.");
  }
}

// Function to start periodic fetching of quotes
function startQuoteSync() {
  fetchQuotesFromServer(); // Initial fetch
  setInterval(fetchQuotesFromServer, 30000); // Fetch every 30 seconds
}

// Function to show notification
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 5000); // Hide after 5 seconds
}

// Load existing quotes from local storage on page load
loadQuotes();

// Populate categories and display quotes on page load
populateCategories();

// Start syncing quotes with the server
startQuoteSync();

// Add event listeners for buttons
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document
  .getElementById("exportJson")
  .addEventListener("click", exportQuotesToJson);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
