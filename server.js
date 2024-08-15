const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies and cookies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static('public'));

// A) Function: findSummation
function findSummation(N = 1) {
  if (typeof N !== 'number' || N <= 0 || !Number.isInteger(N)) {
    return false;
  }
  let summation = 0;
  for (let i = 1; i <= N; i++) {
    summation += i;
  }
  return summation;
}

// B) Function: uppercaseFirstandLast
function uppercaseFirstandLast(str) {
  if (typeof str !== 'string') return false;

  return str.split(' ').map(word => {
    if (word.length > 1) {
      return word.charAt(0).toUpperCase() + word.slice(1, -1) + word.charAt(word.length - 1).toUpperCase();
    }
    return word.toUpperCase();
  }).join(' ');
}

// C) Function: findAverageAndMedian
function findAverageAndMedian(numbers) {
  if (!Array.isArray(numbers) || numbers.some(n => typeof n !== 'number')) {
    return false;
  }

  const average = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;

  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sortedNumbers.length / 2);
  const median = sortedNumbers.length % 2 !== 0 ? sortedNumbers[middle] : (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;

  return { average, median };
}

// D) Function: find4Digits
function find4Digits(str) {
  const match = str.match(/\b\d{4}\b/);
  return match ? match[0] : false;
}

// E) Function: validatePhoneNumber
function validatePhoneNumber(phone) {
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
}

// Routes to test each function

// Route for findSummation
app.post('/findSummation', (req, res) => {
  const N = parseInt(req.body.number, 10);
  const result = findSummation(N);
  res.send(result !== false ? `Summation from 1 to ${N} is: ${result}` : 'Invalid input, please enter a positive integer.');
});

// Route for uppercaseFirstandLast
app.post('/uppercaseFirstandLast', (req, res) => {
  const inputStr = req.body.text;
  const result = uppercaseFirstandLast(inputStr);
  res.send(`Transformed string: ${result}`);
});

// Route for findAverageAndMedian
app.post('/findAverageAndMedian', (req, res) => {
  const numbers = req.body.numbers.split(',').map(Number);
  const result = findAverageAndMedian(numbers);
  res.send(result ? `Average: ${result.average}, Median: ${result.median}` : 'Invalid input, please enter an array of numbers.');
});

// Route for find4Digits
app.post('/find4Digits', (req, res) => {
  const numberStr = req.body.numbers;
  const result = find4Digits(numberStr);
  res.send(result ? `First 4-digit number found: ${result}` : 'No 4-digit number found.');
});

// Route to track visits
app.get('/visit', (req, res) => {
  let visits = parseInt(req.cookies.visits || 0, 10);
  let lastVisit = req.cookies.lastVisit;

  visits += 1;
  res.cookie('visits', visits, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // Cookie expires in 1 year

  const currentTime = new Date();
  res.cookie('lastVisit', currentTime.toString(), { maxAge: 365 * 24 * 60 * 60 * 1000 });

  let message;
  if (visits === 1) {
    message = 'Welcome to my webpage! It is your first time that you are here.';
  } else {
    message = `Hello, this is the ${visits} time that you are visiting my webpage.`;
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);
      message += `<br>Last time you visited my webpage on: ${lastVisitDate.toString()}`;
    }
  }

  res.send(message);
});

// Route to validate phone numbers
app.post('/validatePhoneNumber', (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const name = req.body.name;
  const isValid = validatePhoneNumber(phoneNumber);

  if (isValid) {
    res.send(`The phone number ${phoneNumber} for ${name} is valid.`);
  } else {
    res.send(`The phone number ${phoneNumber} for ${name} is invalid. Please use the format ddd-ddd-dddd.`);
  }
});

// Serve the HTML form to test all functions
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
