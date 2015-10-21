# ChatApp--p2p
used nodejs express socket.io created a chatApp (p2p mode)

install: $npm install
run: $node server.js

user can send both image and texts to each other.
Each messages emitted would be save in mongodb database
For image, need to converted to based64 string first, then save the string in db
the chating dialog has two parts, the upper one can show to previous chating history. 
The lower one shows the current chating messages.

