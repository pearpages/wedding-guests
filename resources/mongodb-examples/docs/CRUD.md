# CRUD

## Inserting

```js
 db.movies.insertOne({"title" : "Stand by Me"})
```

```js
 db.movies.insertMany([{"title" : "Ghostbusters"}, {"title" : "E.T."}, {"title" : "Blade Runner"}]);
```

## Deleting

```js
db.people.deleteOne({"_id": "5e610524e778138b632d6b66"})
```

```js
db.movies.deleteMany({"year" : 1984})
```

### drop

```js
db.movies.deleteMany({})
db.movies.find()
db.movies.drop()
db.movies.find()
```

## Updating Documents

1. updateOne
2. updateMany
3. replaceOne

