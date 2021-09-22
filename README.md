# profile-forms-bot
open source Discord bot coded in Node js with Discord.js and Mongoose.
Feel free to add a star ⭐ to the repository to promote the project!

Currently we have few commands but eventually we will try to grow it !!



# Setup Instructions

>git clone this repo and cd into it 

`touch .env` file and add following content  
```bash
token=
mongoPath=
```
## Normal Setup
<details>

`npm i`  
`node index.js  `

</details>




## Docker Setup

<details>
  
### Running our container

Running our bot with ``-d`` runs the container in detatched mode (as in it runs in the background). If you want to see what is happening, remove that option. 
Let's get to it! Running the following:
```bash
docker run -d my-bot
```
Will deploy our bot to it's own nice little server to play with.

### More information
If you want more of a sanity check here are some following commands you can run!

```bash
# Get the container!
docker ps
# Get addition information
docker ps -a  
docker ps -a -q 
  
# Print the logs
docker logs <our container's ID>
```

That will give us our information and current running logs.

If you need to get inside the container you can run:
```bash
docker exec -it <container id> /bin/bash
```

#### Stop the currently running container
```bash
docker stop $(docker ps -q)
```
 </details>



this project uses  Node v16.9.1
