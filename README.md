# Express Blog SQL

An Express.js blog API with MySQL integration (through mysql2) featuring CRUD operations.

<img src="logo.svg" alt="Node.js logo" width="100">

## Set up the `blog` database

- Create an empty `blog` database in MySQL.
- Import `db/setup/blog_db.sql`, which contains the schema and initial data.
- Verify the import, for example with `SELECT * FROM posts;`.

The application connects to MySQL on `localhost` as `root`. If the user has a
password, provide it through the `DB_PASSWORD` environment variable:

```bash
DB_PASSWORD=your_password npm start
```

## Run locally

- Clone the repo `https://github.com/emanuelefavero/express-blog-sql.git`
- `cd` into the project folder
- Run:

  ```bash
  npm install
  npm start
  ```

- Open your browser and go to `http://localhost:3000` to see the app running.

> To run the project in dev mode, use `npm run dev`.

## API documentation

See the complete [API reference](docs/API.md) for the available endpoints, query
parameters, responses, and errors.

## Test the routes

### Postman

Import `postman/express-blog-sql.postman_collection.json` into Postman. Run the
requests in the `CRUD flow` folder in order so the created post is reused for
the update and delete requests.

### REST Client

You can also use the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code. After installing it, open the `test.http` file and click on "Send Request" to test the routes.

> Tip: We can also use `curl` to quickly test the routes from the command line (e.g. `curl http://localhost:3000/`).

## License

- [MIT](LICENSE.md)

## Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 Documentation](https://sidorares.github.io/node-mysql2/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
