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
  document.body.appendChild(categorySelect);
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          // Merge new quotes with existing quotes
          quotes.push(...importedQuotes);
          alert("Quotes imported successfully!");
          // Optionally: refresh or display a new quote
          showRandomQuote();
        } else {
          alert("Imported data is not a valid array.");
        }
      } catch (error) {
        alert("Error reading file: " + error.message);
      }
    };
    reader.readAsText(file);
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
createAddQuoteForm();
createCategoryDropdown();
updateCategoryDropdown();
showRandomQuote();
