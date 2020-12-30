# Backend

1) Make sure to change your directory to Backend: (Required)
$ cd Backend

2) To Install the needed packages, write in the teminal: (Required)
$ npm i

3) To Set The private Key, write in the terminal: (Required)
$ export EPL_jwtPrivateKey=secret (Mac)
or
$ set EPL_jwtPrivateKey=secret (CMD)
or
$ $env:EPL_jwtPrivateKey="secert" (Powershell)

4) To $set the port number, write in the terminal: (Optional) (Default = 8080)
$ export PORT=3000 (Mac)
or
$ set PORT=3000 (CMD)
or
$ $env:PORT="3000" (Powershell)
$ export 

5) To run the server, write in the terminal: (Required)
$ node index.js
Or To keep running while making changes (For Backend Members Only):
$ npm run serve
