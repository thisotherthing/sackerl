const {series, watch} = require("gulp");
const browserSync = require("browser-sync");
const {transpile} = require("typescript");
const {readFileSync, writeFileSync} = require("fs");
const server = browserSync.create();

const reload = (callback) => {
  server.reload();
  callback();
};

const serve = (callback) => {
  server.init({
    server: {
      baseDir: "./test",
    },
  });
  callback();
};

const updateTestHTML = (callback) => {
  const tischData = readFileSync("./test/tisch-test.txt", "utf8");
  const tischParser = transpile(readFileSync("./tisch-parser.ts").toString());

  const tischHTML = `
    <html>
      <body>
        <script>var exports = {};</script>
        <script>${tischParser}</script>
        <script>
          var parsed = parse(\`${tischData}\`);
          console.log({parsed});
        </script>
        check your console
      </body>
    </html>
  `;

  writeFileSync("./test/index.html", tischHTML, "utf8");

  callback();
};

const watcher = (callback) => {
  watch(["./*.ts"], series(updateTestHTML, reload));
  callback();
};

exports.updateTestHTML = updateTestHTML;

exports.watch = series(
  updateTestHTML,
  serve,
  watcher,
);
