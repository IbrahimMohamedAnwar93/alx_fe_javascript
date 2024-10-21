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
  { text: "The purpose of our lives is to be happy.", category: "Life" },
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
async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();
  const messageContainer = document.getElementById("messageContainer");

  // Validate inputs
  if (newQuoteText && newQuoteCategory) {
    // Create new quote object
    const newQuote = { text: newQuoteText, category: newQuoteCategory };

    // Add new quote to the array
    quotes.push(newQuote);

    // Save quotes to local storage
    saveQuotes();

    // Send new quote to server
    await postQuoteToServer(newQuote);

    // Update the category dropdown
    populateCategories();

    // Display success message
    showNotification("New quote added successfully!", "green");

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Display a new random quote
    showRandomQuote();
  } else {
    // Display error message
    showNotification("Please fill out both fields.", "red");
  }
}

// Function to POST new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Quote successfully posted:", data);
  } catch (error) {
    console.error("Error posting quote to server:", error);
    showNotification("Failed to add quote to server.", "red");
  }
}

// Function to create a notification message
function showNotification(message, color) {
  const messageContainer = document.getElementById("messageContainer");
  messageContainer.textContent = message;
  messageContainer.style.color = color;

  // Automatically hide the message after 3 seconds
  setTimeout(() => {
    messageContainer.textContent = "";
  }, 3000);
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
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  // Clear existing options
  categorySelect.innerHTML = "";

  // Create an "All Categories" option for displaying quotes from any category
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categorySelect.appendChild(allOption);

  // Get unique categories
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  // Create options for each unique category
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Filter quotes based on selected category
  const filteredQuotes =
    selectedCategory === "all"
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

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    showNotification("Quotes imported successfully!", "green");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add event listener for file input to handle import
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);

// Load existing quotes on startup
loadQuotes();
createAddQuoteForm();
populateCategories(); // Populate the categories at the start
showRandomQuote(); // Display an initial random quote

// Periodically sync quotes with server
setInterval(syncQuotes, 10000); // Sync every 10 seconds

// Sync local quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length > 0) {
    const conflictingQuotes = serverQuotes.filter((serverQuote) =>
      quotes.some((localQuote) => localQuote.text === serverQuote.text)
    );

    if (conflictingQuotes.length > 0) {
      showNotification(
        "Conflicts detected. Server data will take precedence.",
        "orange"
      );

      // Handle conflicts by replacing local quotes with server quotes
      conflictingQuotes.forEach((conflict) => {
        const index = quotes.findIndex((q) => q.text === conflict.text);
        if (index !== -1) {
          quotes[index] = conflict; // Replace local with server
        }
      });

      saveQuotes();
      populateCategories();
      showRandomQuote();
    }

    const uniqueQuotes = serverQuotes.filter(
      (serverQuote) =>
        !quotes.some((localQuote) => localQuote.text === serverQuote.text)
    );

    if (uniqueQuotes.length > 0) {
      quotes.push(...uniqueQuotes);
      saveQuotes();
      showNotification("New quotes added from the server!", "green");
      alert("Quotes synced with server!"); // Alert for successful sync
      populateCategories();
      showRandomQuote();
    } else {
      showNotification("No new quotes to add from the server.", "orange");
    }
  } else {
    showNotification("Failed to fetch quotes from the server.", "red");
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    // Transforming data to match quote structure
    return data.map((item) => ({
      text: item.title, // For demonstration, using title as quote text
      category: "Fetched", // You can modify category based on your needs
    }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}
