# Express Blog SQL API

REST API for reading and managing blog posts.

## Base URL

```text
http://localhost:3000
```

## Response formats

The implemented endpoints return JSON where a response body is expected. Error
responses use this structure:

```json
{
  "message": "Error description"
}
```

The successful delete response has no body.

## Post resource

| Property  | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `id`      | integer  | Unique positive identifier    |
| `title`   | string   | Post title                    |
| `content` | string   | Post content                  |
| `image`   | string   | Post image filename           |
| `tags`    | string[] | Tags associated with the post |

Example:

```json
{
  "id": 1,
  "title": "Ciambellone",
  "content": "Sarà che una volta le cose erano più semplici...",
  "image": "ciambellone.avif",
  "tags": ["Dolci", "Torte", "Ricette vegetariane", "Ricette al forno"]
}
```

## Endpoints

| Method   | Path         | Description                  | Current status |
| -------- | ------------ | ---------------------------- | -------------- |
| `GET`    | `/`          | Show general API information | Implemented    |
| `GET`    | `/posts`     | Get all posts                | Implemented    |
| `GET`    | `/posts/:id` | Get one post by ID           | Implemented    |
| `POST`   | `/posts`     | Create a post                | Implemented    |
| `PUT`    | `/posts/:id` | Update a post                | Implemented    |
| `DELETE` | `/posts/:id` | Delete a post                | Implemented    |

### `GET /`

Returns a welcome message and a summary of the available endpoints.

#### Successful response

Status: `200 OK`

```json
{
  "message": "Welcome to the Express Blog API",
  "endpoints": [
    {
      "path": "/",
      "methods": [
        {
          "method": "GET",
          "description": "Mostra le informazioni generali dell'API"
        }
      ]
    },
    {
      "path": "/posts",
      "methods": [
        {
          "method": "GET",
          "description": "Recupera tutti i post"
        },
        {
          "method": "POST",
          "description": "Crea un nuovo post"
        }
      ]
    }
  ]
}
```

The `endpoints` array in the actual response contains all the routes listed in
the [Endpoints](#endpoints) table.

### `GET /posts`

Returns an array containing all posts. Query parameters can be combined; they
are applied in this order: filter by tag, search, sort, and limit.

The INDEX and SHOW responses include the tags associated with each post.

#### Query parameters

| Parameter | Type    | Accepted values      | Description                                                     |
| --------- | ------- | -------------------- | --------------------------------------------------------------- |
| `tag`     | string  | One tag              | Keep posts containing the tag; comparison is case-insensitive   |
| `search`  | string  | Any search term      | Search in `title` and `content`; comparison is case-insensitive |
| `sortBy`  | string  | `id`, `title`        | Sort the resulting posts by the selected property               |
| `order`   | string  | `asc`, `desc`        | Select the sorting direction; requires `sortBy`                 |
| `_limit`  | integer | Any positive integer | Return at most the requested number of posts                    |

When `sortBy` is present and `order` is omitted, the default order is `asc`.
If a valid tag or search term has no matches, the endpoint returns an empty
array with status `200 OK`.

#### Example requests

Filter, search, and sort posts:

```http
GET /posts?tag=dolci&search=torta&sortBy=title&order=desc
```

Sort by descending ID and return at most two posts:

```http
GET /posts?sortBy=id&order=desc&_limit=2
```

#### Successful response (get all posts)

Status: `200 OK`

```json
[
  {
    "id": 5,
    "title": "Torta paesana",
    "content": "La torta paesana è un dolce di origine lombarda...",
    "image": "torta_paesana.avif",
    "tags": [
      "Dolci",
      "Torte",
      "Ricette vegetariane",
      "Ricette al forno",
      "Dolci al cioccolato"
    ]
  }
]
```

#### Error responses

Status: `400 Bad Request`

A `400` response is returned when:

- `sortBy` is not `id` or `title`;
- `order` is provided without `sortBy`;
- `order` is not `asc` or `desc`;
- `_limit` is not a positive integer;
- a query parameter that expects one value is repeated.

Example:

```http
GET /posts?sortBy=date
```

```json
{
  "message": "Campo sortBy non valido. I valori consentiti sono: id, title"
}
```

Only one value is supported for each query parameter. For example,
`?tag=dolci&tag=pasta` is not supported and returns `400 Bad Request`.

### `GET /posts/:id`

Returns the post with the requested ID.

#### Path parameters

| Parameter | Type    | Description              |
| --------- | ------- | ------------------------ |
| `id`      | integer | Positive post identifier |

#### Example request (GET post)

```http
GET /posts/1
```

#### Successful response (get single post)

Status: `200 OK`

```json
{
  "id": 1,
  "title": "Ciambellone",
  "content": "Sarà che una volta le cose erano più semplici...",
  "image": "ciambellone.avif",
  "tags": ["Dolci", "Torte", "Ricette vegetariane", "Ricette al forno"]
}
```

#### Invalid ID

Status: `400 Bad Request`

Returned when `id` is not a positive integer, for example `/posts/abc` or
`/posts/0`.

```json
{
  "message": "L'id deve essere un numero intero positivo"
}
```

#### Post not found

Status: `404 Not Found`

Returned when the ID is valid but does not belong to an existing post.

```json
{
  "message": "Post non trovato"
}
```

### `POST /posts`

Creates a new post. The server generates the `id`; the request body must contain
only `title`, `content`, `image`, and `tags`.

#### Example request (POST)

```json
{
  "title": "Scialatielli ai frutti di mare",
  "content": "Un primo piatto tipico della Costiera Amalfitana.",
  "image": "scialatielli_frutti_mare.avif",
  "tags": ["primi piatti", "ricette di pesce"]
}
```

#### Successful response (create post)

Status: `201 Created`

The response contains the created post and a `Location` header such as
`/posts/6`.

```json
{
  "id": 6,
  "title": "Scialatielli ai frutti di mare",
  "content": "Un primo piatto tipico della Costiera Amalfitana.",
  "image": "scialatielli_frutti_mare.avif",
  "tags": ["primi piatti", "ricette di pesce"]
}
```

#### Invalid body

Status: `400 Bad Request`

Returned when a required field is missing or invalid, or the body contains an
unexpected field. Tags must be an array of non-empty strings.

```json
{
  "message": "Il campo title è obbligatorio e deve essere una stringa non vuota"
}
```

### `PUT /posts/:id`

Replaces an existing post. The request body follows the same rules as
`POST /posts`, and all four fields are required.

#### Successful response (update post)

Status: `200 OK`

```json
{
  "id": 1,
  "title": "Ciambellone aggiornato",
  "content": "Nuovo contenuto.",
  "image": "ciambellone.avif",
  "tags": ["dolci", "torte"]
}
```

Invalid IDs and bodies return `400 Bad Request`. A valid ID that does not belong
to a post returns `404 Not Found`.

### `DELETE /posts/:id`

Deletes the post with the requested ID.

#### Path parameters (delete)

| Parameter | Type    | Description              |
| --------- | ------- | ------------------------ |
| `id`      | integer | Positive post identifier |

#### Example request (delete)

```http
DELETE /posts/1
```

#### Successful response (delete post)

Status: `204 No Content`

The response has no body.

#### Invalid ID (delete)

Status: `400 Bad Request`

Returned when `id` is not a positive integer.

```json
{
  "message": "L'id deve essere un numero intero positivo"
}
```

#### Post not found (delete)

Status: `404 Not Found`

Returned when the ID is valid but does not belong to an existing post.

```json
{
  "message": "Post non trovato"
}
```

## Error demonstration routes

These exercise routes deliberately trigger the error middleware and do not
modify posts. Both log the original error in the terminal.

| Method | Path                  | Status | JSON response                            |
| ------ | --------------------- | ------ | ---------------------------------------- |
| `GET`  | `/errors`             | `500`  | `{ "message": "Internal Server Error" }` |
| `GET`  | `/errors/unavailable` | `503`  | `{ "message": "Service Unavailable" }`   |

Use the requests in `test.http` to try them.

## Unknown routes

Requests that do not match an existing route return:

Status: `404 Not Found`

```json
{
  "message": "Not Found: GET /non-existent"
}
```

## Current implementation notes

- Posts, tags, and their relationships are stored in MySQL. The legacy
  `data/posts.json` file is retained as an exercise reference but is not used by
  the posts repository.
- Creating and updating a post uses a transaction because each operation can
  modify `posts`, `tags`, and `post_tag` together.
- Multiple values for the same query parameter are not supported.
- A query parameter that is present but empty is invalid and returns
  `400 Bad Request`.
- Query parameters that are not recognized are currently ignored.
