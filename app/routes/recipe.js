'use strict';

const BaseRoute = require('./baseRoute');

class Recipe extends BaseRoute {
  constructor () {
    super('Recipe', true);

    /* GET Routes */
    this.get('/form', this.getForm.bind(this));

    /* POST Routes */
    this.post('/form', this.handleUpload.bind(this));
  }

  async handleUpload (req) {
    const user = req.user;

    try {
      const uploadStreamHandler = (stream) => {
        
      }

      const payload = await this.uploadFilesToStorage(req, uploadStreamHandler);

      return;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  getForm (req, res) {
    res.writeHead(200, { Connection: 'close' });
    res.end('<html><head></head><body>\
               <form method="POST" enctype="multipart/form-data">\
                <input type="text" name="textfield"><br />\
                <input type="file" name="filefield"><br />\
                <input type="submit">\
              </form>\
            </body></html>');
  }
}

module.exports = Recipe;
