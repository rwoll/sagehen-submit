Sagehen Submit
==============

*A computer science centric submission portal.*

## Quickstart

1. Clone this repo.
2. Install [MongoDB](https://docs.mongodb.org/manual/installation/).
3. Install node dependencies:
   ```bash
   cd /path/to/clone/location
   npm install
   ```
4. Start a MongoDB instance: `mongod`
5. Seed the user database with `node setup`
   > This will create a user with the following credentials as a `PROF` role:  
   > ```
   > email: prof@test
   > password: testpass
   > ```

6. Start up the app: `npm start`
7. Visit http://localhost:3000 to see if its up and running.
8. Test various endpoints through `curl` or apps like [Postman](https://www.getpostman.com/).


## API Documentation

*While the eventual goal will be to have a complete RESTful API, the following
list includes (documented) implemented endpoints.*

| Method | Endpoint | Usage | Returns	| Auth? |
|--------|----------|-------|---------|-------|
|`POST`  | `/auth`  | Obtain a JWT for API calls | `token` ||
|`POST`  | `/api/v1/users` | Creates a user | `user` | `PROF` |

> Ensure data is encoded in requests!

### Getting an Auth token

#### Example Request:

```bash
curl --request POST \
  --url http://localhost:3000/auth \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'email=prof%40test&password=testpass'
```

#### Example Response

```bash
{
    "token": "<YOUR-JWT-TOKEN>"
}
```


### Adding Users

#### Example Request

```bash
curl --request POST \
  --url http://localhost:3000/api/v1/users \
  --header 'authorization: <YOU-JWT-Token>' \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'email=hghghgcgtest&password=true&role=STU'
```

#### Example Response

```bash
{
    "user": {
        "__v": 0,
        "_id": "56898e54e407812e7391a42f",
        "active": false,
        "created": "2016-01-03T21:10:44.235Z",
        "email": "hghghgcgtest",
        "role": "STU",
        "verified": false
    }
}
```
