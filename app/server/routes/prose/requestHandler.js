const { readFile } = require("node:fs/promises");
const { join } = require("node:path");
const govukMarkdown = require("govuk-markdown");
const createError = require("http-errors");
const { marked } = require("marked");

marked.use(
  govukMarkdown({
    headingsStartWith: "xl",
  }),
);

/**
 * Get HTML with GOV.UK styles for a Markdown content file.
 * @param {import('node:fs').PathLike} path Path to a .md file
 * @returns {string} HTML for the content with GOV.UK typography classes
 */
async function renderContent(path) {
  const markdown = await readFile(path, {
    encoding: "utf8",
  });

  return marked(markdown);
}

/**
 * Middleware that magically renders properly-formatted content from Markdown.
 * Assumes that there is a Markdown file with the same name as the route path
 * in ./content
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
async function requestHandler(req, res, next) {
  try {
    const { page } = req.params;

    const path = join(__dirname, `./content/${page}.md`);

    const html = await renderContent(path);

    res.render("layouts/prose.njk", {
      content: html,
      cache: true,
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      // We didn't find the file; this is effectively a 404
      return next(createError(404));
    }

    next(err);
  }
}

module.exports = requestHandler;
