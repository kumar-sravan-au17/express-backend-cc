const express = require("express");
const axios = require("axios");

const dataRoute = express.Router();

/**
 * @openapi
 * /data:
 *   get:
 *     summary: Fetches entries from public APIs with filtering options
 *     tags: [Data]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter the entries by the specified category.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit the number of entries returned.
 *     responses:
 *       200:
 *         description: An array of entries from public APIs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             examples:
 *               arrayExample:
 *                 value: [
 *                   {
 *                     "API": "AdoptAPet",
 *                     "Description": "Resource to help get pets adopted",
 *                     "Auth": "apiKey",
 *                     "HTTPS": true,
 *                     "Cors": "yes",
 *                     "Link": "https://www.adoptapet.com/public/apis/pet_list.html",
 *                     "Category": "Animals"
 *                   },
 *                   {
 *                     "API": "Axolotl",
 *                     "Description": "Collection of axolotl pictures and facts",
 *                     "Auth": "",
 *                     "HTTPS": true,
 *                     "Cors": "no",
 *                     "Link": "https://theaxolotlapi.netlify.app/",
 *                     "Category": "Animals"
 *                   }
 *                 ]
 *       400:
 *         description: Invalid limit parameter.
 *       500:
 *         description: Error fetching data from the public APIs.
 */

dataRoute.get("/", async (req, res) => {
  const categoryQuery = req.query.category;
  const limitQuery = req.query.limit;
  const parsedLimitQuery = parseInt(limitQuery);
  const queryParam = categoryQuery ? `?category=${categoryQuery}` : "";
  if (limitQuery && isNaN(parsedLimitQuery)) {
    return res.status(400).send({
      message: "Invalid limit",
    });
  } else if (parsedLimitQuery === 0) {
    return res.status(400).send({
      message: "Limit must be more than 0",
    });
  }
  try {
    const response = await axios.get(
      `https://api.publicapis.org/entries${queryParam}`
    );
    const entries = response.data.entries;
    if (!isNaN(parsedLimitQuery)) {
      entries.length = parsedLimitQuery;
    }
    res.json(entries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});

module.exports = { dataRoute };
