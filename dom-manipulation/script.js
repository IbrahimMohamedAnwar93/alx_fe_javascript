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
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  // Add new quote to the array if inputs are valid
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    alert("New quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote(); // Display a new quote after adding
  } else {
    alert("Please fill out both fields.");
  }
}

// Add event listeners to buttons
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Create the quote addition interface
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

formContainer.appendChild(quoteInput);
formContainer.appendChild(categoryInput);
formContainer.appendChild(addQuoteButton);
document.body.appendChild(formContainer);

// Display a random quote on initial load
showRandomQuote();
