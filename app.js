import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import qr from "qr-image"; 
import fs from "fs";
import path from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/",(req,res)=>{
  res.render(__dirname+"/views/index.ejs");
});

app.get("/about",(req,res)=>{
  res.render(__dirname+"/views/about.ejs");
});

app.get("/contact",(req,res)=>{
  res.render(__dirname+"/views/contact.ejs");
});

app.post("/",(req,res)=>{
  const url = req.body.url;
  const qr_svg = qr.image(url);
  const qrFilePath = path.join(__dirname, 'public', 'qr_image.png');
  const usedUrlFilePath = path.join(__dirname, 'public', 'USED_url.txt');

  const writeStream = fs.createWriteStream(qrFilePath);
  qr_svg.pipe(writeStream);

  writeStream.on('finish', () => {
    console.log('QR image saved successfully.');
    fs.writeFile(usedUrlFilePath, url, (err) => {
      if (err) throw err;
      console.log("The URL has been saved!");
    });
    res.render(path.join(__dirname, 'views', 'result.ejs'));
  });

  writeStream.on('error', (err) => {
    console.error('Error saving QR image:', err);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});