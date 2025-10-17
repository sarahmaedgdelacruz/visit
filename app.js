const express = require("express");
const session = require("express-session");
const app = express();

// setup session
app.use(
  session({
    secret: "sarahprinsesa",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// helper function
function getQuote(viewCount) {
  if (viewCount % 2 === 0) return "Even flowers need rain";
  else return "Beat the odds";
}

// main route
app.get("/", (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }

  const message = getQuote(req.session.views);
  req.session.lastMessage = message;

  res.send(`
    <h1>You are Visitor #${req.session.views}</h1>
    <p>"${message}"</p>

    <form action="/reset" method="GET">
      <button type="submit">Reset</button>
    </form>

    <form action="/repeat" method="GET">
      <button type="submit">Repeat</button>
    </form>
  `);
});

// reset button
app.get("/reset", (req, res) => {
  req.session.views = 0;
  req.session.lastMessage = getQuote(req.session.views);
  res.send(`Session has been reset`);
});

// repeat button
app.get("/repeat", (req, res) => {
  const views = req.session.views || 1;
  const message = req.session.lastMessage || getQuote(views);

  res.send(`
    <h1>"${message}"</h1>
    <p>You are Visitor #${views}<p>

    <form action="/" method="GET">
      <button type="submit">Back</button>
    </form>
  `);
});

const PORT = 8000;
app.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
