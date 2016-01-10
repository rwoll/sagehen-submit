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

> **The following documentation may not refer to currently implemented
> functionality, but rather the desired functionality in the future.**

### Assignments
*Resource contains the details of a homework or project assignment like the
required files, duedate, and a list of submissions.*

| Usage                                 | Method | Endpoint                    |
|---------------------------------------|--------|-----------------------------|
| Get a list of all assignments.        |`GET`   |`/assignments`               |
| Create a new assignment.              |`POST`  |`/assignments`               |
| Get an individual assignment          |`GET`   |`/assignments/{aID}`         |
| Delete an assignment.                 |`DELETE`|`/assignments/{aID}`         |
| Update an assignment.                 |`PUT`   |`/assignments/{aID}`         |

#### Assignment Description
- `_id`: unique assignment identifier
- `title`: name of the assignment
- `duedate`: due date of the assignment
- `reqFiles`: list of required files
- `submissions`: list of submissions (rather, references to a submission via an `_id`)

### Submissions
*A resource that contains a student's solution/code to an assignment*

| Usage                                 | Method | Endpoint                    |
|---------------------------------------|--------|-----------------------------|
| Get a list of submissions.            |`GET`   |`/assignments/{aID}/submissions`|
| Make an original submission.          |`POST`  |`/assignments/{aID}/submissions`|
| Get an individual submission.         |`GET`   |`/assignments/{aID}/submissions/{sID}`|
| Delete an individual submission.      |`DELETE`|`/assignments/{aID}/submissions/{sID}`|
| Update an individual submission.      |`PUT`   |`/assignments/{aID}/submissions/{sID}`|

#### Submission Description
- `_id`: unique identifier
- `owner`: owner/original submitter (reference to a User's `_id`)
- `collaborators`: list of collaborators as User's `_id`s
- `assignment`: reference to an Assignment's `_id` that this submission corresponds to
- `timestamp`: original submission time or time of last revision
- `files`: list of File resources
- `notes`: student notes on their submission

### Users
*A resource that represents either a professor, teaching assistant, or student.*

| Usage                                 | Method | Endpoint                    |
|---------------------------------------|--------|-----------------------------|
| Get a list of all users.              |`GET`   |`/users`                     |
| Create a new user.                    |`POST`  |`/users`                     |
| Get a user profile.                   |`GET`   |`/users/{uID}`               |
| Update a user profile.                |`PUT`   |`/users/{uID}`               |
| Mark student as enrolled in the class.|`POST`  |`/users/{uID}/enroll`        |
| Get a list of submissions by a user.  |`GET`   |`/users/{uID}/submissions`   |
| Get a list of assignments with submission status for a user.|`GET`|`/users/{uID}/assignments`|

#### User Description
- `_id`: unique identifier
- `email`: primary email address
- `password`: hash of password
- `verified`: status of User's primary email address
- `active`: status of User in the course
- `created`: date of User added
- `role`: Users role (`PROF || TA || STU`)

## Auth Tokens

All API calls will require an `AUTH` token which will be used to authorize different
actions.

### Getting an Auth token

##### Example Request:

```bash
curl --request POST \
  --url http://localhost:3000/auth \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'email=prof%40test&password=testpass'
```

##### Example Response

```bash
{
    "token": "<YOUR-JWT-TOKEN>"
}
```

The returned token can then be used in subsequent API calls. It will have an
expiry time, so it will need to be refreshed.
