import express from 'express';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  const fs = require('fs');

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query;

    if (!image_url) {
      return res.status(400)
        .send(`an image url is required`);
    }
    let image_response: any = "";

    try {
      image_response = await filterImageFromURL(image_url);
  } catch (e) {
      console.error(e);
  }

    console.log(image_response)

    var pathToImages = image_response.split("/").slice(0, image_response.split("/").length - 1).join("/");
    var toDelete: string[] = [];

    var files = fs.readdirSync(pathToImages);

    files.forEach((file: string) => {
      let fileStat = fs.statSync(pathToImages + '/' + file).isDirectory();
      if (!fileStat) {
        toDelete.push(pathToImages + '/' + file);
      }
    });

    console.log(toDelete)


    return res.status(200).on("finish", () => {
      deleteLocalFiles(toDelete)
    }).sendFile(image_response);
  }
  );

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();

function listener(event: Event, arg1: string, listener: any, arg3: undefined) {
  throw new Error('Function not implemented.');
}
