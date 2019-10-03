# my-pi-home


## Api description: http://77.55.217.143/api/swagger/


### how to run dev app
####client
npm run start 

#### backend
npm run start:dev 

#### mock pi server
node main.js


##
##

### how to run prod app
####client
npm run build && 
./start.sh

#### backend
./start.sh

#### pi server
pm2 start pm2.config.js



