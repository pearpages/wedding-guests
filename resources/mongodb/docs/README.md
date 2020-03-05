# MongoDB

## Installing on macOS

> [Installing on macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

---

## Intro

The primary reason for moving away from the relational model is to make **scaling** out easier.

| MongoDB          | SQL      |
| ---------------- | -------- |
| Document         | Row      |
| Collection (_id) | Table    |
| Database         | Database |

|Special Collections|
|---|
|system.users|
|system.namespaces|

| Special Databases | description                          |
| ----------------- | ------------------------------------ |
| admin             | authentication and authorization     |
| local             | data used in the replication process |
| config            | information about each *shard*       |

 Separate databases are useful when storing data for several applications or users on the same MongoDB server.

> #### MongoShell
> MongoDB is distributed with a simple but powerful tool called the mongo shell. The mongo shell provides built-in support for administering MongoDB instances and manipulating data using the MongoDB query language.

> #### Schemas 
> Defining *schemas* for your application is good practice and can be enforced through the use of MongoDB’s documentation validation functionality and object–document mapping libraries available for many programming languages.

> #### Subcollection
> One convention for organizing collections is to use namespaced subcollections separated by the . character. For example, an application containing a blog might have a collection named blog.posts and a separate collection named blog.authors. 

> #### Namespace
> By concatenating a database name with a collection in that database you can get a fully qualified collection name, which is called a namespace. For instance, if you are using the *blog.posts collection* in the cms database, the namespace of that collection would be *cms.blog.posts*.

### Starting the Server

```bash
mongod
```

It is important to create the data directory ```(e.g., mkdir -p /data/db/)``` and to make sure your user has permission to write to the directory before starting MongoDB.

>  By default MongoDB    listens for socket connections on port **27017**. 

> #### Selected DB
> ```
> db
> ```

> #### Chande DB
> ```
> use Blog
> ```

> #### Access Collections
> ```
> db.posts
> ```

### CRUD Operations

| CRUD   | Function   | Example                          |
| ------ | ---------- | -------------------------------- |
| Create | insertOne  | ```db.movies.insertOne(movie)``` |
| Read   | find       | ```db.movies.find().pretty()```  |
| Read   | findOne    | ```db.movies.findOne()```        |
| Update | updateOne  | ```db.movies.updateOne()```      |
| Delete | deleteOne  | ```db.movies.deleteOne()```      |
| Delete | deleteMany | ```db.movies.deleteMany()```     |

### Basic Data Types

Documents in MongoDB can be thought of as **JSON-like**.

1. Null
2. Boolean
3. Number
4. String
5. Date
6. Regular expression
7. Array
8. Embedded document
9. Object ID
10. Binary data
11. Code

### Javascript equivalents to shell helpers

| Helper           | Equivalent              |
| ---------------- | ----------------------- |
| use video        | db.getSisterDB("video") |
| show dbs         | db.getMongo().getDBs()  |
| show collections | db.getCollectionNames() |

---
