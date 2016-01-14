Sagehen Submit
==============
![Travis](https://travis-ci.org/rwoll/sagehen-submit.svg?branch=master)

*A computer science centric submission portal.*

## About

The goal is to create a submission service for computer science courses powered
by a REST API allowing for easy interfacing with command line clients,
web-clients, etc.

## Getting Started

### Server and MongoDB Install

1. Install [MongoDB](https://docs.mongodb.org/manual/installation/).
2. Install [NodeJs](https://nodejs.org/en/download/).
3. Clone this repository and enter the working directory:
   ```
   git clone https://github.com/rwoll/sagehen-submit.git && cd sagehen-submit
   ```
4. Seed the database and start the server:
   ```
   node ./setup && npm start
   ```

   > This well seed MongoDB with the following credentials:
   > ```
   > username: prof@test
   > password: testpass
   > ```

5. You can interact with the API on `http://localhost:3000`.

### Installing the CLI tool

> The CLI tool is written in Python, so install that if it is not already on
> your device. (If you're a Mac user, the machines come pre-installed with
> Python 2.7, but it is advisable that you run it in a python `virtualenv`.)

1. Assuming you are in the repos base directory, install the python dependencies:
   ```
   pip install -r cli/requirements.txt
   ```
2. Make the `cecil` script executable:
   ```
   chmod +x ./cli/cecil
   ```
3. Run `./cli/cecil --help` to get a list of commands available and begin using
   the tool.

> To use the script's methods, make sure you login: `./cli/cecil login`. It will
> prompt you for your credentials and store an API token that will last for
> **60 minutes**. (After that you will get an error, so force a refresh by
> running log in again. In the future a method will be added to prompt you to
> log in for new token if the current one is expired.)

## Tests

To run the tests on the API (assuming you have `mocha` globally installed), run:
```
npm test
```

> It should be noted that the included tests are very high-level and would
> appreciate some help and additions. Most notably, the internal methods of the
> node server are not being tested individually. The tests simply check see that
> API calls return the correct information, but they don't necessarily check
> that all the information is persisted in MongoDB (well, to some extent they do).
>
> If you would like to contribute test cases it would be very helpful!

## Contributions

Contributions in the form of pull requests, comments, or suggestions will always
be appreciated. This project is more of a proof of concept, so the code is not
really production ready :frowning:, but any help getting it closer to that
would be great! :smile:

## API Documentation

> All requests must supply a JWT token in the header, otherwise you will receive
> an error status code of `401`!

- [List Assignments](#list-assignments)
- [Create a New Assignment](#create-a-new-assignment)
- [Get an Individual Assignment](#get-an-individual-assignment)
- [Get a List of Submissions](#get-a-list-of-submissions)
- [Submit an Assignment](#submit-an-assignment)

### List Assignments

Lists the authenticated user's assignments.

```
GET /assignments
```

#### Request

```
GET /api/v1/assignments HTTP/1.1
Host: localhost:3000
Authorization: "YOUR_TOKEN"
```

#### Response

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 235
Date: Mon, 11 Jan 2016 21:46:00 GMT
```

```json
{
  "assignments": [
    {
      "_id": "56941450f0c266c44058ef81",
      "title": "Hello World Assignment",
      "__v": 0,
      "duedate": "2016-01-11T20:32:12.000Z"
    },
    {
      "_id": "5694148ff0c266c44058ef84",
      "title": "Goodnight Moon",
      "__v": 0,
      "duedate": "2016-01-20T20:32:12.000Z"
    }
  ]
}
```

### Create a New Assignment

Create a new assignment.

```
POST /assignments
```

> Requires `PROF` status.

#### Request

```
POST /api/v1/assignments HTTP/1.1
Host: localhost:3000
Authorization: "YOUR_TOKEN"
Content-Type: application/json
```

```json
{
    "title": "Hello World Assignment",
    "duedate": "Mon Jan 11 15:32:12 EST 2016",
    "files": {
        "helloworld.java": {
            "type": "text/x-java-source",
            "lang": "java"
        },

        "cecil.java": {
            "type": "text/x-java-source",
            "lang": "java"
        }

    }
}
```

#### Response

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Content-Length: 375
Date: Mon, 11 Jan 2016 20:39:47 GMT
```

```json
{
    "assignment": {
        "__v": 0,
        "title": "Hello World Assignment",
        "files": {
            "cecil.java": {
                "filename": "cecil.java",
                "type": "text/x-java-source",
                "lang": "java",
                "_id": "5694121cf0c266c44058ef7a"
            },
            "helloworld.java": {
                "filename": "helloworld.java",
                "type": "text/x-java-source",
                "lang": "java",
                "_id": "5694121cf0c266c44058ef79"
            }
        },
        "_id": "5694121cf0c266c44058ef78",
        "duedate": "2016-01-11T20:32:12.000Z"
    }
}
```

### Get an Individual Assignment

Get an individual assignment.

```
GET /assignments/{assignmentID}
```

### Get a List of Submissions

Gets a list of submissions for an assignment.

```
GET /assignments/{assignmentID}/submissions
```

> A full list will be return if role is `PROF` otherwise it will be a list for
> the authenticated user.

### Submit an Assignment

Make a new submission for an assignment.

```
POST /assignments/{assignmentID}/submissions
```

> Requires role `STU`.

#### Request

```
POST /api/v1/assignments/{assignmentID}/submissions HTTP/1.1
Host: localhost:3000
Authorization: "YOUR_TOKEN"
Content-Type: application/json
```

```json
{
  "notes" : "I tried my best!",
  "files": {
    "test.py":
        {
            "content": "# some really awesome python scripting"
        },

    "test2.py":
        {
          "content": "# some redundant scripting"
        }
  }
}
```

#### Response

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Content-Length: 541
Date: Tue, 12 Jan 2016 01:32:20 GMT
```

```json
{
  "submission": {
    "__v": 0,
    "owner": "56944d554221097a4303f117",
    "assignment": "56944d7a4221097a4303f118",
    "files": {
      "test2.py": {
        "filename": "test2.py",
        "content": "# some redundant scripting",
        "_id": "56945a8332fac5db43a0193a"
      },
      "test.py": {
        "filename": "test.py",
        "content": "# some really awesome python scripting",
        "_id": "56945a8332fac5db43a01939"
      }
    },
    "notes": "I tried my best!",
    "_id": "56945a8332fac5db43a01938",
    "timestamp": "2016-01-12T01:44:35.671Z"
  }
}
```

### Get a Submission

Gets a submission for an assignment.

```
GET /assignments/{assignmentID}/submissions/{submissionID}
```

> If the authenticated user has role `STU`, they will get an error if they try
> to access a submission that they do not own or are not a collaborator on.

#### Request

```
GET /api/v1/assignments/56944d7a4221097a4303f118/submissions/56945e8d41ae3bf94343b468 HTTP/1.1
Host: localhost:3000
Authorization: "YOUR_AUTH_TOKEN"
```

### Response

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 432
```

```json
{
  "submission": {
    "_id": "56945e8d41ae3bf94343b468",
    "owner": "56944d554221097a4303f117",
    "assignment": "56944d7a4221097a4303f118",
    "files": {
      "test.py": {
        "_id": "56945e8d41ae3bf94343b469",
        "content": "# some really awesome python scripting",
        "filename": "test.py"
      },
      "test2.py": {
        "_id": "56945e8d41ae3bf94343b46a",
        "content": "# some redundent scripting",
        "filename": "test2.py"
      }
    },
    "notes": "I tried my best!",
    "__v": 0,
    "timestamp": "2016-01-12T02:01:49.634Z"
  }
}
```
