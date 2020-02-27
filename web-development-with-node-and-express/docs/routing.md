# Routing

## Information Architecture (IA)

IA refers to the conceptual organization of your content. Having an extensible (but not overcomplicated) IA before you begin thinking about routing will pay huge dividends down the line.

[About IA](https://www.w3.org/Provider/Style/URI.html)

Being able to see the problem from multiple perspectives will give you better ideas and expose the flaws in your own IA.

- Never expose technical details in your URLs
- Avoid meaningless information in your URLs
- Avoid needlessly long URLs
- Never use whitespace or untypable characters
- Use lowercase for your URLs

## SEO

In particular, if there are certain keywords that are important—and it makes sense—consider making them part of the URL. For example, Meadowlark Travel offers several Oregon Coast vacations. To ensure high search engine ranking for these vacations, we use the string “Oregon Coast” in the title, header, body, and meta description, and the URLs start with /vacations/oregon-coast. The Manzanita vacation package can be found at /vacations/oregon-coast/manzanita. If, to shorten the URL, we simply used /vacations/manzanita, we would be losing out on valuable SEO.

## Subdomains

- api.example.com
- admin.example.com
- blog.example.com

There are usually SEO consequences to partitioning your content using subdomains, which is why you should generally reserve them for areas of your site that aren’t important to SEO, such as admin areas and APIs. Keep this in mind and make sure there’s no other option before using a subdomain for content that is important to your SEO plan.

If you want to handle a subdomain separately, you can use a **package** called **vhost** (for “virtual host,” which comes from an Apache mechanism commonly used for handling subdomains).

### vhosts

```js
// create "admin" subdomain...this should appear
// before all your other routes
var admin = express.Router();
app.use(vhost("admin.meadowlark.local", admin));

// create admin routes; these can be defined anywhere
admin.get("*", (req, res) => res.send("Welcome, Admin!"));

// regular routes
app.get("*", (req, res) => res.send("Welcome, User!"));
```

express.Router() essentially creates a new instance of the Express router. You can treat this instance just like your original instance (app). You can add routes and middleware just as you would to app. However, it won’t do anything until you add it to app. We add it through vhost, which binds that router instance to that subdomain.

### Route Handlers Are Middleware

```js
app.get("/fifty-fifty", (req, res, next) => {
  if (Math.random() < 0.5) return next();
  res.send("sometimes this");
});
app.get("/fifty-fifty", (req, res) => {
  res.send("and sometimes that");
});
```

In the previous example, we have two handlers for the same route. Normally, the first one would win, but in this case, the first one is going to pass approximately half the time, giving the second one a chance.

```js
function authorize(req, res, next) {
  if (req.session.authorized) return next();
  res.render("not-authorized");
}

app.get("/public", () => res.render("public"));

app.get("/secret", authorize, () => res.render("secret"));
```

### Regular Expressions

Let’s say you want the URLs /user and /username to be handled by the same route:

```js
app.get("/user(name)?", (req, res) => res.render("user"));
```

We don’t want our users to have to remember if it’s 2 a’s or 3 or 10. The following will get the job done:

```js
app.get("/khaa+n", (req, res) => res.render("khaaan"));
```

```js
app.get(/crazy|mad(ness)?|lunacy/, (req, res) => res.render("madness"));
```

### Route Parameters

```js
const staff = {
  mitch: {
    name: "Mitch",
    bio: "Mitch is the man to have at your back in a bar fight."
  },
  madeline: { name: "Madeline", bio: "Madeline is our Oregon expert." },
  walt: { name: "Walt", bio: "Walt is our Oregon Coast expert." }
};

app.get("/staff/:name", (req, res, next) => {
  const info = staff[req.params.name];
  if (!info) return next(); // will eventually fall through to 404
  res.render("05-staffer", info);
});
```

```js
const staff = {
  portland: {
    mitch: { name: "Mitch", bio: "Mitch is the man to have at your back." },
    madeline: { name: "Madeline", bio: "Madeline is our Oregon expert." }
  },
  bend: {
    walt: { name: "Walt", bio: "Walt is our Oregon Coast expert." }
  }
};

app.get("/staff/:city/:name", (req, res, next) => {
  const cityStaff = staff[req.params.city];
  if (!cityStaff) return next(); // unrecognized city -> 404
  const info = cityStaff[req.params.name];
  if (!info) return next(); // unrecognized staffer -> 404
  res.render("staffer", info);
});
```

### Organizing Routes

- Use named functions for route handlers
- Routes should not be mysterious: you break the routes out by functional areas. However, even then, it should be clear where you should go to look for a given route.
- Route organization should be extensible
- Don’t overlook automatic view-based route handlers

### Declaring Routes in a Module

```js
const routes = require("./routes.js");

routes.forEach(route => app[route.method](route.handler));
```

or

```js
module.exports = app => {
  app.get("/", (req, res) => app.render("home"));

  //...
};
```

```js
const addRoutes = require("./routes");

addRoutes(app);
```

### Grouping Handlers Logically

It’s better to somehow group related functionality together. That makes it easier not only to leverage shared functionality, but also to make changes in related methods.

#### Handlers

```js
const fortune = require("../lib/fortune");

exports.home = (req, res) => res.render("home");

exports.about = (req, res) => {
  const fortune = fortune.getFortune();
  res.render("about", { fortune });
};

//...
```

```js
const main = require("./handlers/main");

module.exports = function(app) {
  app.get("/", main.home);
  app.get("/about", main.about);
  //...
};
```

### Automatically Rendering Views

Let’s say you want to add the file views/foo.handlebars and just magically have it available on the route /foo.

```js
const autoViews = {};
const fs = require("fs");
const { promisify } = require("util");
const fileExists = promisify(fs.exists);

app.use(async (req, res, next) => {
  const path = req.path.toLowerCase();
  // check cache; if it's there, render the view
  if (autoViews[path]) return res.render(autoViews[path]);
  // if it's not in the cache, see if there's
  // a .handlebars file that matches
  if (await fileExists(__dirname + "/views" + path + ".handlebars")) {
    autoViews[path] = path.replace(/^\//, "");
    return res.render(autoViews[path]);
  }
  // no view found; pass on to 404 handler
  next();
});
```

Note that this approach will run into problems if you delete a view that had been visited; it will have been added to the autoViews object, so subsequent views will try to render it even though it’s been deleted, resulting in an error. The problem could be solved by wrapping the rendering in a try/catch block and removing the view from autoViews when an error is discovered.
