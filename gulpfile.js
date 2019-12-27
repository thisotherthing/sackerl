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

const getTischParserES5 = () => {
  return transpile(readFileSync("./tisch-parser.ts").toString(), {target: "es5", module: "CommonJS"})
    .replace(/ {4}/mg, "  ")
    .replace(/^.*exports.*$/mg, "");
};

const updateTestHTML = (callback) => {
  const tischData = readFileSync("./test/tisch-test.txt", "utf8");

  const tischHTML = `
    <html>
      <body>
        <script>${getTischParserES5()}</script>
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
  watch(["./test/*.txt", "./*.ts"], series(updateTestHTML, reload));
  callback();
};

const es5Script = (callback) => {
  writeFileSync("./build/es5-tisch-parser.js", getTischParserES5(), "utf8");

  callback();
};

exports.es5Script = es5Script;
exports.watch = series(
  updateTestHTML,
  serve,
  watcher,
);
