// Array to store quotes, each quote has a text and a category
const quotes = [
  {
    text: "The journey of a thousand miles begins with one step.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "You miss 100% of the shots you don't take.",
    category: "Inspiration",
  },
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    category: "Self-Identity",
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    category: "Motivation",
  },
  {
    text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    category: "Friendship",
  },
  {
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    category: "Mindfulness",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    category: "Success",
  },
  {
    text: "The purpose of our lives is to be happy.",
    category: "Life",
  },
  {
    text: "You have within you right now, everything you need to deal with whatever the world can throw at you.",
    category: "Strength",
  },
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear previous quote
  quoteDisplay.innerHTML = "";

  // Create and display new quote element
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteDisplay.appendChild(quoteText);

  // Create and display category element
  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  quoteDisplay.appendChild(quoteCategory);

  // Announce the new quote to screen readers
  quoteDisplay.setAttribute("aria-live", "polite");
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();
  const messageContainer = document.getElementById("messageContainer");

  // Validate inputs
  if (newQuoteText && newQuoteCategory) {
    // Add new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Save quotes to local storage
    saveQuotes();

    // Update the category dropdown
    updateCategoryDropdown();

    // Display success message
    messageContainer.textContent = "New quote added successfully!";
    messageContainer.style.color = "green";

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Display a new random quote
    showRandomQuote();
  } else {
    // Display error message
    messageContainer.textContent = "Please fill out both fields.";
    messageContainer.style.color = "red";
  }
}

// Function to create the quote addition form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.className = "quote-form";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addQuoteButton = document.createElement("button");
  addQuoteButton.textContent = "Add Quote";
  addQuoteButton.onclick = addQuote;

  // Create a message container for displaying feedback
  const messageContainer = document.createElement("div");
  messageContainer.id = "messageContainer";

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addQuoteButton);
  formContainer.appendChild(messageContainer);
  document.body.appendChild(formContainer);
}

// Function to update the category dropdown with unique categories
function updateCategoryDropdown() {
  const categorySelect = document.getElementById("categorySelect");

  // Clear existing options
  categorySelect.innerHTML = "";

  // Get unique categories
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  // Create an "All" option for displaying quotes from any category
  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.textContent = "All";
  categorySelect.appendChild(allOption);

  // Create options for each unique category
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotesByCategory() {
  const selectedCategory = document.getElementById("categorySelect").value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Filter quotes based on selected category
  const filteredQuotes =
    selectedCategory === "All"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  // Select a random quote from the filtered list
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Clear previous quote
    quoteDisplay.innerHTML = "";

    // Create and display new quote element
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteDisplay.appendChild(quoteText);

    // Create and display category element
    const quoteCategory = document.createElement("small");
    quoteCategory.textContent = `Category: ${randomQuote.category}`;
    quoteDisplay.appendChild(quoteCategory);
  } else {
    quoteDisplay.textContent = "No quotes available in this category.";
  }
}

// Create category selection dropdown
function createCategoryDropdown() {
  const categorySelect = document.createElement("select");
  categorySelect.id = "categorySelect";
  categorySelect.addEventListener("change", filterQuotesByCategory);
  document.body.insertBefore(
    categorySelect,
    document.getElementById("quoteDisplay")
  );

  updateCategoryDropdown();
}

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes.push(...JSON.parse(storedQuotes));
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to export quotes to a JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save updated quotes to local storage
    updateCategoryDropdown(); // Update category dropdown after importing
    alert("Quotes imported successfully!");
    showRandomQuote(); // Show a random quote after import
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to initialize the application
function initializeApp() {
  loadQuotes(); // Load existing quotes from local storage
  createAddQuoteForm();
  createCategoryDropdown(); // Populate categories
  showRandomQuote(); // Show a random quote
}

// Adding button for exporting quotes
function createExportButton() {
  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes";
  exportButton.onclick = exportQuotes;
  document.getElementById("exportContainer").appendChild(exportButton);
}

// Function to populate categories dynamically
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  // Clear existing options
  categorySelect.innerHTML = "";

  // Get unique categories
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  // Create an "All" option
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categorySelect.appendChild(allOption);

  // Create options for each unique category
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  // Restore last selected category from local storage
  const lastSelectedCategory =
    localStorage.getItem("lastSelectedCategory") || "all";
  categorySelect.value = lastSelectedCategory;

  // Update quotes displayed based on last selected category
  filterQuotesByCategory();

  // Save selected category to local storage on change
  categorySelect.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    localStorage.setItem("lastSelectedCategory", selectedCategory);
    filterQuotesByCategory();
  });
}

// Run the application on window load
window.onload = initializeApp;

// Function to simulate fetching quotes from a mock server
function fetchQuotesFromServer() {
  // Simulating a network request with setTimeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated server data (for example purposes, it can be replaced with an API call)
      const serverQuotes = [
        { text: "New quote from the server.", category: "Inspiration" },
        { text: "Another server quote.", category: "Motivation" },
      ];
      resolve(serverQuotes);
    }, 2000); // Simulate 2 seconds delay
  });
}

// Function to sync quotes with the server
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Merge server quotes into local quotes, using the server data if there's a conflict
    serverQuotes.forEach((serverQuote) => {
      const existingQuoteIndex = quotes.findIndex(
        (quote) => quote.text === serverQuote.text
      );
      if (existingQuoteIndex !== -1) {
        // Conflict detected, server quote takes precedence
        quotes[existingQuoteIndex] = serverQuote;
        alert(`Quote updated: "${serverQuote.text}"`);
      } else {
        // No conflict, simply add the new quote
        quotes.push(serverQuote);
      }
    });

    saveQuotes(); // Update local storage with new quotes
    updateCategoryDropdown(); // Refresh category dropdown
    showRandomQuote(); // Show a new random quote
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

// Function to start periodic syncing
function startPeriodicSync() {
  syncQuotes(); // Initial sync
  setInterval(syncQuotes, 10000); // Sync every 10 seconds
}

// Call the function to set everything up
initializeApp();
createExportButton();
startPeriodicSync(); // Start syncing process
