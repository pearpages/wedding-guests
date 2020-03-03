# Web development with Node and Express

```
git clone https://github.com/EthanRBrown/web-development-with-node-and-express-2e
```

---

### Event-Driven Programming

The core philosophy behind Node is that of event-driven programming. What that means for you, the programmer, is that you have to understand what events are available to you and how to respond to them.

### Routing

For web-based client/server applications, the client specifies the desired content in the URL; specifically, the path and querystring.

### Serving Static Resources

We’re going to have to do the work of opening the file, reading it, and then sending its contents along to the browser.

---

## Express

### path

The path is what defines the route. Note that app.METHOD does the heavy lifting for you: by default, it doesn’t care about the case or trailing slash, and it doesn’t consider the querystring when performing the match. So the route for the About page will work for /about, /About, /about/, /about?foo=bar, /about/?foo=bar, etc.

Instead of using Node’s low-level res.end, we’re switching to using Express’s extension, res.send. We are also replacing Node’s res.writeHead with res.set and res.status. Express is also providing us a convenience method, res.type, which sets the Content-Type header. While it’s still possible to use res.writeHead and res.end, it isn’t necessary or recommended.

### handlebars

Note that we no longer have to specify the content type or status code: the view engine will return a content type of text/html and a status code of 200 by default. In the catchall handler, which provides our custom 404 page, and the 500 handler, we have to set the status code explicitly.

Even though every time you visit the home page, you get the same HTML, these routes are considered dynamic content, because we could make a different decision each time the route gets called.

### Static Files and Views

```js
app.use(express.static(__dirname + "/public"));
```

Remember that middleware is processed in order, and static middleware—which is usually declared first or at least very early—will override other routes. For example, if you put an index.html file in the public directory (try it!), you’ll find that the contents of that file get served instead of the route you configured! So if you’re getting confusing results, check your static files and make sure there’s nothing unexpected matching the route.

---

### modules

Node modules are sometimes called CommonJS (CJS) modules, in reference to an older specification that Node took inspiration from. The JavaScript language is adopting an official packaging mechanism, called ECMAScript Modules (ESM). If you’ve been writing JavaScript in React or another progressive frontend language, you may already be familiar with ESM, which uses import and export (instead of exports, module.exports, and require). For more information, see Dr. Axel Rauschmayer’s blog post “ECMAScript 6 modules: the final syntax”.

---

## QA

- How to write unit tests with Jest
- How to write integration tests with Puppeteer
- How to configure ESLint to help prevent common errors

1. Reach. SEO in our QA.
2. Functionality
3. Usability. HCI (Human Computer Interaction)
4. Aesthetics

```
Logic vs Presentation
```

- Unit tests
- Integration tests
- Linting

```
# Entropic Functionality
Functionality that is random
```

### Unit Testing

- Mocking

### Integration Testing

- Puppeteer

## Lint

The original JavaScript linter is Douglas Crockford’s JSLint. In 2011, Anton Kovalyov forked JSLint, and JSHint was born. Kovalyov found that JSLint was becoming too opinionated, and he wanted to create a more customizable, community-developed JavaScript linter. After JSHint came Nicholas Zakas’ ESLint, which has become the most popular choice (it won by a landslide in the 2017 State of JavaScript survey). In addition to its ubiquity, ESLint appears to be the most actively maintained linter, and I prefer its flexible configuration over JSHint, and it is what I am recommending.

### Continous Integration

Currently, the most popular CI server for Node projects is Travis CI. Travis CI is a hosted solution, which can be appealing (it saves you from having to set up your own CI server). If you’re using GitHub, it offers excellent integration support. CircleCI is another option.

---

## The Request and Response

### Parts of URL

- Protocol
- Host
- Port
- Path
- Querystring: Both names and values should be URL encoded. JavaScript provides a built-in function to do that: encodeURIComponent.
- Fragment: The fragment (or hash) is not passed to the server at all; it is strictly for use by the browser. Some single-page applications use the fragment to control application navigation. Originally, the fragment’s sole purpose was to cause the browser to display a specific part of the document, marked by an anchor tag

### Request Methods

POST, GET, DELETE, PUT, CONNECT, OPTIONS, TRACE, ...

### Request Headers

```js
// req.headers
app.get("/headers", (req, res) => {
  res.type("text/plain");
  const headers = Object.entries(req.headers).map(
    ([key, value]) => `${key}: ${value}`
  );
  res.send(headers.join("\n"));
});
```

### Request body

The most common media type for POST bodies is application/x-www-form-urlencoded, which is simply encoded name/value pairs separated by ampersands (essentially the same format as a querystring). If the POST needs to support file uploads, the media type is multipart/form-data, which is a more complicated format. Lastly, Ajax requests can use application/json for the body.

### Request Object

- params
- query
- body
- route
- cookies | signedCookies
- headers
- accet(types)
- ip
- path
- hostname
- xhr
- protocol
- secure
- url | originalUrl

### Response Headers

- Content-Type

### Response Object

- status(code)
- set(name, value)
- cookie(name, value, ...)
- redirect([status], url)
- send(body)
- json(json)
- jsonp(json)
- end()
- type(type)
- format(object)
- attachment(...), download(...)
- sendFile(...)
- links(links)
- locals, render

### Express source

[Express Api](http://expressjs.com/en/api.htmls)

- lib
  - application.js
  - express.js
  - request.js
  - response.js
  - router/route.js

### Rendering content

```js
// basic usage
app.get("/about", (req, res) => {
  res.render("about");
});
```

```js
app.get("/error", (req, res) => {
  res.status(500);
  res.render("error");
});

// or on one line...

app.get("/error", (req, res) => res.status(500).render("error"));
```

```js
app.get("/greeting", (req, res) => {
  res.render("greeting", {
    message: "Hello esteemed programmer!",
    style: req.query.style,
    userid: req.cookies.userid,
    username: req.session.username
  });
});
```

```js
// the following layout doesn't have a layout file, so
// views/no-layout.handlebars must include all necessary HTML
app.get("/no-layout", (req, res) => res.render("no-layout", { layout: null }));
```

```js
// the layout file views/layouts/custom.handlebars will be used
app.get("/custom-layout", (req, res) =>
  res.render("custom-layout", { layout: "custom" })
);
```

```js
app.get("/text", (req, res) => {
  res.type("text/plain");
  res.send("this is a test");
});
```

```js
// this should appear AFTER all of your routes
// note that even if you don't need the "next" function, it must be
// included for Express to recognize this as an error handler
app.use((err, req, res, next) => {
  console.error("** SERVER ERROR: " + err.message);
  res
    .status(500)
    .render("08-error", { message: "you shouldn't have clicked that!" });
});
```

```js
// this should appear AFTER all of your routes
app.use((req, res) => res.status(404).render("404"));
```

### Processing Forms

```js
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
```

```js
app.post("/process-contact", (req, res) => {
  try {
    // here's where we would try to save contact to database or other
    // persistence mechanism...for now, we'll just simulate an error
    if (req.body.simulateError) throw new Error("error saving contact!");
    console.log(`contact from ${req.body.name} <${req.body.email}>`);
    res.format({
      "text/html": () => res.redirect(303, "/thank-you"),
      "application/json": () => res.json({ success: true })
    });
  } catch (err) {
    // here's where we would handle any persistence failures
    console.error(
      `error processing contact from ${req.body.name} ` + `<${req.body.email}>`
    );
    res.format({
      "text/html": () => res.redirect(303, "/contact-error"),
      "application/json": () =>
        res.status(500).json({
          error: "error saving contact information"
        })
    });
  }
});
```

### Providing an API

```js
app.get("/api/tours", (req, res) => {
  const toursXml =
    '<?xml version="1.0"?><tours>' +
    tours
      .map(p => `<tour price="${p.price}" id="${p.id}">${p.name}</tour>`)
      .join("") +
    "</tours>";
  const toursText = tours
    .map(p => `${p.id}: ${p.name} (${p.price})`)
    .join("\n");
  res.format({
    "application/json": () => res.json(tours),
    "application/xml": () => res.type("application/xml").send(toursXml),
    "text/xml": () => res.type("text/xml").send(toursXml),
    "text/plain": () => res.type("text/plain").send(toursXml)
  });
});
```

---

## Form Handling

Browsers often place limits on querystring length (there is no such restriction for body length).

```html
<!-- if you do not specify method it defaults to gET -->
<form action="/process" method="POST">
  <input type="hidden" name="hush" val="hidden, but not secret!" />
  <div>
    <label for="fieldColor">Your favorite color: </label>
    <input type="text" id="fieldColor" name="color" />
  </div>
  <div>
    <button type="submit">Submit</button>
  </div>
</form>
```

### Encoding

If you don’t explicitly specify an encoding, it defaults to **application/x-www-form-urlencoded** (this is just a lengthy media type for “URL encoded”). This is a basic, easy-to-use encoding that’s supported by Express out of the box.

#### Files

If you need to upload files, things get more complicated. There’s no easy way to send files using URL encoding, so you’re forced to use the multipart/form-data encoding type, which is not handled directly by Express.

### 303 redirect

After processing the form, you can send HTML directly back to the browser (a view, for example). This approach will produce a warning if the user attempts to reload the page and can interfere with bookmarking and the Back button, and for these reasons, it is not recommended.

The 303 response code was added in HTTP 1.1 to address the misuse of the 302 redirect. The HTTP specification specifically indicates that the browser should use a GET request when following a 303 redirect, regardless of the original method. This is the recommended method for responding to a form submission request.

- Redirect to dedicated success/failure pages (Analytics friendly)
- Redirect to the original location with a flash message (small forms)
- Redirect to a new location with a flash message (large forms)

```js
app.get("/newsletter-signup", handlers.newsletterSignup);
app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);
app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);
```

With most frontend frameworks, it is more common to see form data sent in JSON form with the fetch API, which we’ll be looking at next. However, it’s still good to understand how browsers handle form submission by default,

### Using Fetch to Send Form Data

Using the fetch API to send JSON-encoded form data is a much more modern approach that gives you more control over the client/server communication and allows you to have fewer page refreshes.

```html
<div id="newsletterSignupFormContainer">
  <form class="form-horizontal role="form" id="newsletterSignupForm">
    <!-- the rest of the form contents are the same... -->
  </form>
</div>
```

```html
<script>
  document
    .getElementById("newsletterSignupForm")
    .addEventListener("submit", evt => {
      evt.preventDefault();
      const form = evt.target;
      const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        name: form.elements.name.value,
        email: form.elements.email.value
      });
      const headers = { "Content-Type": "application/json" };
      const container = document.getElementById(
        "newsletterSignupFormContainer"
      );
      fetch("/api/newsletter-signup", { method: "post", body, headers })
        .then(resp => {
          if (resp.status < 200 || resp.status >= 300)
            throw new Error(`Request failed with status ${resp.status}`);
          return resp.json();
        })
        .then(json => {
          container.innerHTML = "<b>Thank you for signing up!</b>";
        })
        .catch(err => {
          container.innerHTML =
            `<b>We're sorry, we had a problem ` +
            `signing you up. Please <a href="/newsletter">try again</a>`;
        });
    });
</script>
```

---

## Cookies and Sessions

HTTP is a stateless protocol. That means that when you load a page in your browser and then you navigate to another page on the same website, neither the server nor the browser has any intrinsic way of knowing that it’s the same browser visiting the same site. Another way of saying this is that the way the web works is that every HTTP request contains all the information necessary for the server to satisfy the request.

### Cookies

- Cookies are not secret from the user
- The user can delete or disallow cookies
- Regular cookies can be tampered with
- Cookies can be used for attacks
- Users will notice if you abuse cookies
- Prefer sessions over cookies

#### Externalizing Credentials

It’s a common practice to externalize third-party credentials, such as the cookie secret, database passwords, and API tokens (Twitter, Facebook, etc.).

```js
const env = process.env.NODE_ENV || "development";
const credentials = require(`./.credentials.${env}`);
module.exports = { credentials };
```

#### Cookies in Express

Before you start setting and accessing cookies in your app, you need to include the cookie-parser middleware.

```bash
npm install cookie-parser
```

```js
const cookieParser = require("cookie-parser");
app.use(cookieParser(credentials.cookieSecret));
```

```js
res.cookie("monster", "nom nom");
res.cookie("signed_monster", "nom nom", { signed: true });
```

### Sessions

Sessions are really just a more convenient way to maintain state. To implement sessions, something has to be stored on the client; otherwise, the server wouldn’t be able to identify the client from one request to the next. The usual method of doing this is a cookie that contains a unique identifier. The server then uses that identifier to retrieve the appropriate session information.

Other ways to maintain state were devised, such as decorating URLs with session information. These techniques were messy, difficult, and inefficient, and they are best left in the past. HTML5 provides another option for sessions called local storage, which offers an advantage over cookies if you need to store larger amounts of data.

Broadly speaking, there are two ways to implement sessions: store everything in the cookie or store only a unique identifier in the cookie and everything else on the server.

#### Memory Stores

If you would rather store session information on the server, which I recommend, you have to have somewhere to store it.

```bash
npm install express-session
```

```js
const expressSession = require("express-session");
// make sure you've linked in cookie middleware before
// session middleware!
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
  })
);
```

---

## Middleware

Conceptually, middleware is a way to encapsulate functionality—specifically, functionality that operates on an HTTP request to your application. Practically, middleware is simply a function that takes three arguments: a request object, a response object, and a next() function.

In an Express app, you insert middleware into the pipeline by calling `app.use`. The important part about this analogy is that order matters.

It’s common practice to have the last middleware in your pipeline be a catchall handler for any request that doesn’t match any other routes. This middleware usually returns a status code of 404 (Not Found).

- Verb (GET, POST, PUT, ...)
- Path
- Callback
- next()

```js
app.use((req, res, next) => {
  console.log(`processing request for ${req.url}....`);
  next();
});

app.use((req, res, next) => {
  console.log("terminating request");
  res.send("thanks for playing!");
  // note that we do NOT call next() here...this terminates the request
});

app.use((req, res, next) => {
  console.log(`whoops, i'll never get called!`);
});
```

```js
const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("\n\nALLWAYS");
  next();
});

app.get("/a", (req, res) => {
  console.log("/a: route terminated");
  res.send("a");
});
app.get("/a", (req, res) => {
  console.log("/a: never called");
});
app.get("/b", (req, res, next) => {
  console.log("/b: route not terminated");
  next();
});
app.use((req, res, next) => {
  console.log("SOMETIMES");
  next();
});
app.get("/b", (req, res, next) => {
  console.log("/b (part 2): error thrown");
  throw new Error("b failed");
});
app.use("/b", (err, req, res, next) => {
  console.log("/b error detected and passed on");
  next(err);
});
app.get("/c", (err, req) => {
  console.log("/c: error thrown");
  throw new Error("c failed");
});
app.use("/c", (err, req, res, next) => {
  console.log("/c: error detected but not passed on");
  next();
});

app.use((err, req, res, next) => {
  console.log("unhandled error detected: " + err.message);
  res.send("500 - server error");
});

app.use((req, res) => {
  console.log("route not handled");
  res.send("404 - not found");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}` +
      "; press Ctrl-C to terminate."
  )
);
```

### Common Middleware

- basicauth-middleware
- body-parser
- busboy, multiparty, formidable, multer
- compression
- cookie-parser
- cookie-session
- express-session
- csurf
- serve-index
- errorhandler
- serve-favicon
- morgan
- method-override
- response-time
- static
- vhost

---

## Sending Email

There are different solutions, from different providers.

You either use some module like "nodemailer" and use SMTP. Or use some other external module and API.

---

## Production Concerns

```bash
export NODE_ENV=production
node meadowlark.js
```

```bash
NODE_ENV=production node meadowlark.js
```

### Morgan (login middleware)

Morgan is the most common login middleware.

```bash
npm install morgan
```

```js
const morgan = require("morgan");
const fs = require("fs");

switch (app.get("env")) {
  case "development":
    app.use(morgan("dev"));
    break;
  case "production":
    const stream = fs.createWriteStream(__dirname + "/access.log", {
      flags: "a"
    });
    app.use(morgan("combined", { stream }));
    break;
}
```

### Process manager

- Forever
- PM2

Forever is a little more straightforward and easy to get started, and PM2 offers more features.

### Scaling

These days, scaling usually means one of two things: scaling up or scaling out. Scaling up refers to making servers more powerful: faster CPUs, better architecture, more cores, more memory, etc. Scaling out, on the other hand, simply means more servers.

### Handling Uncaught Exceptions

```js
app.use((err, req, res, next) => {
  console.error(err.message, err.stack);
  app.status(500).render("500");
});
```

```js
process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION\n", err.stack);
  // do any cleanup you need to do here...close
  // database connections, etc.
  process.exit(1);
});
```

```js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "** YOUR DSN GOES HERE **" });

process.on("uncaughtException", err => {
  // do any cleanup you need to do here...close
  // database connections, etc.
  Sentry.captureException(err);
  process.exit(1);
});
```

### Third-Party Uptime Monitors

UptimeRobot is free for up to 50 monitors and is simple to configure.

### Stress Testing

If you stress test your application regularly and benchmark it, you’ll be able to recognize problems. If you just finished a feature and you find that your connection times have tripled, you might want to do some performance tuning on your new feature!

---

## Persistence

### Filesystem persistence

Filesystem persistence has some drawbacks. In particular, it doesn’t scale well.

You should favor databases over filesystems for storing data. The one exception is storing binary files, such as images, audio files, or videos.

### Cloud Persistence

```js
const filename = 'customerUpload.jpg'

s3.putObject({
  Bucket: 'uploads',
  Key: filename,
  Body: fs.readFileSync(__dirname + '/tmp/ + filename),
})
```

### Database Persistence

- MongoDB (have instead focused on concurrency to scale performance -MongoDB: The Definitive Guide (O’Reilly)-)
- PostgreSQL

#### MongoDB

- mLab online service
- mongoose (object document mapper (ODM). The most popular ODM for MongoDB is Mongoose.)

---

## REST APIs and JSON

_Web service_ is a general term that means any application programming interface (API) that’s accessible over HTTP.

The acronym REST stands for representational state transfer, and the grammatically troubling RESTful is used as an adjective to describe a web service that satisfies the principles of REST.

The basics are that REST is a stateless connection between a client and a server. The formal definition of REST also specifies that the service can be cached and that services can be layered (that is, when you use a REST API, there may be other REST APIs beneath it).

JSON hass better JavaScript support, and it’s a simpler, more compact format.

```bash
# It has become a standard to use POST for creating something, and PUT for updating (or modifying) something.

GET /api/vacations
# Retrieves vacations

GET /api/vacation/:sku
# Returns a vacation by its SKU

POST /api/vacation/:sku/notify-when-in-season
# Takes email as a querystring parameter and adds a notification listener for the specified vacation

DELETE /api/vacation/:sku
# Requests the deletion of a vacation; takes email (the person requesting the deletion) and notes as querystring parameters
```

[RESTful API Design - POST vs PUT vs PATCH](https://blog.fullstacktraining.com/restful-api-design-post-vs-put-vs-patch/)

To avoid excessively long URLs, I recommend using the request body to pass large blocks of data (for example, the deletion request notes).

[JSON:API (A SPECIFICATION FOR BUILDING APIS IN JSON)](https://jsonapi.org/)

### API Error Reporting

- Catastrophic errors (the request will time out.)
- Recoverable server errors ( A 500 response code is appropriate in this situation.)
- Client errors ( The most useful response codes in this case are 404 (Not Found), 400 (Bad Request), and 401 (Unauthorized).)

### Client Errors

The most useful response codes in this case are 404 (Not Found), 400 (Bad Request), and 401 (Unauthorized).

Additionally, the response body should contain an explanation of the specifics of the error. If you want to go above and beyond, the error message would even contain a link to documentation. Note that if the user requests a list of things and there’s nothing to return, this is not an error condition. It’s appropriate to simply return an empty list.

## Cross-Origin Resource Sharing

Specifically, the protocol, domain, and port must match. This makes it impossible for your API to be used by another site, which is where cross-origin resource sharing (CORS) comes in.

CORS allows you to lift this restriction on a case-by-case basis, even allowing you to list which domains specifically are allowed to access the script.

CORS is implemented through the **Access-Control-Allow-Origin header**.

The easiest way to implement it in an Express application is to use the cors package (npm install cors). To enable CORS for your application, use this:

```js
const cors = require("cors");

app.use(cors());
```

In our case, we want to expose our entire API (but only the API), so we’re going to restrict CORS to paths starting with /api:

```js
const cors = require("cors");

app.use("/api", cors());
```

## Testing the API

There are ways around this, such as the excellent application **Postman**. However, whether or not you use such a utility, it’s good to have automated tests.

Before we write tests for our API, we need a way to actually call a REST API. For that, we’ll be using a Node package called **node-fetch**, which replicates the browser’s fetch API:

```js
npm install --save-dev node-fetch@2.6.0
```

```js
const fetch = require("node-fetch");

const baseUrl = "http://localhost:3000";

const _fetch = async (method, path, body) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  const res = await fetch(baseUrl + path, { method, body, headers });
  if (res.status < 200 || res.status > 299)
    throw new Error(`API returned status ${res.status}`);
  return res.json();
};

describe("API tests", () => {
  test("GET /api/vacations", async () => {
    const vacations = await _fetch("get", "/api/vacations");
    expect(vacations.length).not.toBe(0);
    const vacation0 = vacations[0];
    expect(vacation0.name).toMatch(/\w/);
    expect(typeof vacation0.price).toBe("number");
  });

  test("GET /api/vacation/:sku", async () => {
    const vacations = await _fetch("get", "/api/vacations");
    expect(vacations.length).not.toBe(0);
    const vacation0 = vacations[0];
    const vacation = await _fetch("get", "/api/vacation/" + vacation0.sku);
    expect(vacation.name).toBe(vacation0.name);
  });

  test("POST /api/vacation/:sku/notify-when-in-season", async () => {
    const vacations = await _fetch("get", "/api/vacations");
    expect(vacations.length).not.toBe(0);
    const vacation0 = vacations[0];
    // at this moment, all we can do is make sure the HTTP request is successful
    await _fetch(
      "post",
      `/api/vacation/${vacation0.sku}/notify-when-in-season`,
      { email: "test@meadowlarktravel.com" }
    );
  });

  test("DELETE /api/vacation/:id", async () => {
    const vacations = await _fetch("get", "/api/vacations");
    expect(vacations.length).not.toBe(0);
    const vacation0 = vacations[0];
    // at this moment, all we can do is make sure the HTTP request is successful
    await _fetch("delete", `/api/vacation/${vacation0.sku}`);
  });
});
```

One is that we are relying on the API being already started and running on port 3000.

Second, this test relies on data already being present in our API.

You might have scripts that set up and seed a test database, attach the API to it, and tear it down for every test run.

## Using Express to Prove an API
