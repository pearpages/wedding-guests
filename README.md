# Backend

## Parsing Request Body JSON

```js
const express = require('express')

app.use(express.json())    // <==== parse request body as JSON

app.post('/test', (req, res) => {
  res.json({requestBody: req.body})  // <==== req.body will be a parsed JSON object
})
```

## Sending POST message with fetch

```js
(async () => {
  const rawResponse = await fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const content = await rawResponse.json();

  console.log(content);
})();
```

## Email Validation trhough regex

+ [Email Address Regular Expression That 99.99% Works. Disagree? ](https://emailregex.com/)

## Express CORS

+ [cors](https://expressjs.com/en/resources/middleware/cors.html)

## Email with mailgun account

```
"mailgun-js": "^0.22.0"
```