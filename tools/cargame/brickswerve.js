container = document.getElementById("container")
car = document.getElementById("car")

function gameStart() {
    document.getElementById("gamestart").remove()

    containerrect = container.getBoundingClientRect()
    x0 = containerrect.left
    y0 = containerrect.top

    container.style.position = "absolute"
    container.style.left = x0 + "px"
    container.style.top = y0 + "px"

    car.style.width = "20px"
    car.style.height = "40px"
    
    xrel = 290
    car.style.left = xrel + "px"
    car.style.marginTop = "300px"
    car.style.border = "2px solid black"

    wall1 = document.createElement("div")
    car.after(wall1)
    wall1.setAttribute('id', "wall1")
    wall1.setAttribute('class', 'obstacle')
    wall1.style.height = "400px"
    wall1.style.width = "20px"
    wall1.style.position = "absolute"
    xrel_wall1 = 80
    wall1.style.left = xrel_wall1 + "px"
    wall1.style.top = "-2px"

    wall2 = document.createElement("div")
    wall1.after(wall2)
    wall2.setAttribute('id', 'wall2')
    wall2.setAttribute('class', 'obstacle')
    wall2.style.height = "400px"
    wall2.style.width = "20px"
    wall2.style.position = "absolute"
    xrel_wall2 = 500
    wall2.style.left = xrel_wall2+ "px"
    wall2.style.top = "-2px"
    
    leftBound = document.getElementById("wall1").getBoundingClientRect().right
    rightBound = document.getElementById("wall2").getBoundingClientRect().left

    console.log(leftBound)
    
    container.style.backgroundColor = "#959da1"

    obstacleMaster = []

    makeObstacles()
    collisionDetected = false

    originaltime = Date.now()
    pastpixels = 0

    document.addEventListener('keydown', function(event) {
            
        if(event.key == 'ArrowLeft' && !keyPressed) {
            if (xrel < 10) {
                xrel = 0
            }
            else {
                xrel -= 8;
            }
            xpos = xrel + container.getBoundingClientRect().left
            car.style.left = xrel + "px"
            keyPressed = true
        }
        else if(event.key == 'ArrowRight' && !keyPressed) {
            if (xrel > 572) {
                xrel = 580
            }
            else {
                xrel += 8;
            }
            xpos = xrel + container.getBoundingClientRect().left
            car.style.left = xrel + "px"
            keyPressed = true
        }
        else if(event.key == 'Space') {
            while (!(event.key == 'Space'));
        }
    })           

    requestAnimationFrame(gameLoop)

        function gameLoop() {

            carRect = document.getElementById("car").getBoundingClientRect()
            car_x0 = carRect.left
            car_x1 = carRect.right
            car_y0 = carRect.top
            car_y1 = carRect.bottom

            currentObstacles = obstacleMaster[0]
            newRect = document.getElementById(currentObstacles[0]).getBoundingClientRect()
            if ((newRect.top < car_y0 && car_y0 < newRect.bottom) || (newRect.top < car_y1 && car_y1 < newRect.bottom) || (newRect.bottom < car_y1 && car_y0 < newRect.top)) {
                collisionDetected = detectCollision()
            }

            if (pastpixels > 200) {
                pastpixels = 0
                makeObstacles()
            }
            keyPressed = false
            
            time1 = Date.now()
            if (parseInt(document.getElementById("score").innerHTML) < 50000) {
                refreshRate = 30
            }
            else if (parseInt(document.getElementById("score").innerHTML) < 100000) {
                refreshRate = 28
            }
            else {
                refreshRate = 25
            }

            while (Date.now() < time1 + refreshRate) {
                car.style.left = xrel + "px"
                if (!(100 < xrel && xrel < 482)) {
                    collisionDetected = true
                }
            }

            document.getElementById("score").innerHTML = Date.now() - originaltime

            for (i = 0; i<obstacleMaster.length; i++) {
                toRemove = false
                for (j = 0; j<obstacleMaster[i].length; j++) {
                    obstacle = document.getElementById(obstacleMaster[i][j])
                    if (parseInt(obstacle.style.top.replace("px","")) > 375) {
                        toRemove = true
                        obstacle.remove()
                    }
                    else {
                        obstacle.style.top = (parseInt(obstacle.style.top.replace("px","")) + 3)+"px"
                    }
                }
                if (toRemove) {
                    obstacleMaster.shift()
                    toRemove = false
                }
            }

            pastpixels = pastpixels + 3
            if (collisionDetected == false) {
                requestAnimationFrame(gameLoop)
            }
            else {
                finalscore = parseInt(document.getElementById("score").innerHTML)
                document.getElementById("score").innerHTML = "GAME OVER: " + finalscore

                refreshLink = document.createElement("a")
                document.getElementById("scorecontainer").after(refreshLink)
                
                refreshLink.setAttribute("id", "refreshlink")
                refreshLink.setAttribute("href", "index.html")
                refreshLink.style.textDecoration = "none"
                refreshButton = document.createElement("input")
                refreshLink.appendChild(refreshButton)
                refreshButton.setAttribute("id", "refresh")
                refreshButton.setAttribute("type", "button")
                refreshButton.setAttribute("onclick", 'function reload() {window.location.reload()}')
                refreshButton.setAttribute("value", "Play Again!")
                refreshButton.setAttribute("class", "gamebutton")
                
                container.style.transform = "translateY(50px)"

            }

        }

        function makeObstacles() {
            obstacleIteration = []

            numOfHoles = Math.floor(Math.random() * 3) + 1
            holeLocations = []

            roadwidth = 400

            for (i=0; i < numOfHoles; i++) {
                newLocation = Math.floor(Math.random() * (roadwidth - 40)) + 1
                holeLocations.push(newLocation)
            }

            
            if (parseInt(document.getElementById("score").innerHTML) < 50000) {
                maxHoleShift = 180
            }
            else if (parseInt(document.getElementById("score").innerHTML) < 100000) {
                maxHoleShift = 200
            }
            else {
                maxHoleShift = 225
            }

            if (!(holeLocations.some(function(val) {return xrel - maxHoleShift < val && val < xrel + maxHoleShift})) || Math.min(holeLocations) > 360) {
                
                if (xrel - maxHoleShift < 100) {
                    newLocation = Math.floor(Math.random() * (xrel + maxHoleShift - 100)) + 100
                }
                else if (xrel + maxHoleShift > 500) {
                    newLocation = Math.floor(Math.random() * maxHoleShift) + 140
                }
                else {
                    newLocation = Math.floor(Math.random() * maxHoleShift * 2) + (xrel - maxHoleShift)
                }
                holeLocations.push(newLocation)
            }

            holeLocations.sort(function(a, b) {return a > b ? 1 : -1});
            obstacles = {}
            minObstacle = 0

            for (i=0; i < holeLocations.length; i++) {
                if (minObstacle < holeLocations[i]) {
                    obstacles[minObstacle] = holeLocations[i] - minObstacle
                }
                if (holeLocations[i] + 45 > roadwidth) {
                    obstacles[minObstacle] = roadwidth - minObstacle
                }
                else {
                    minObstacle = holeLocations[i] + 45
                }
                
            }

            obstacles[minObstacle] = roadwidth - minObstacle
            obstacleList = Object.keys(obstacles)

            timestamp = Date.now()
            for (i=0; i<obstacleList.length; i++) {
                newObstacle = document.createElement("div")
                car.after(newObstacle)
                newObstacle.setAttribute('id', timestamp + " - " + i)
                obstacleIteration.push(timestamp + " - " + i)
                newObstacle.setAttribute('class', 'obstacle')
                newObstacle.style.height = "20px"
                newObstacle.style.width = obstacles[obstacleList[i]] + "px"
                newObstacle.style.position = "absolute"
                xrel_newObstacle = obstacleList[i]
                temp = parseInt(xrel_newObstacle) + 100
                newObstacle.style.left = temp + "px"
                newObstacle.style.top = 20 + "px"

            }

            obstacleMaster.push(obstacleIteration)

        }

        function detectCollision() {
            for (i=0; i < obstacleMaster[0].length; i++) {
                newRect = document.getElementById(obstacleMaster[0][i]).getBoundingClientRect()
                if ((newRect.left < car_x0 && car_x0 < newRect.right) || (newRect.left < car_x1 && car_x1 < newRect.right) || (newRect.right < car_x1 && car_x0 < newRect.left)) {
                    return true
                }
            }
            return false
        }    
    
    };
    

    

    

    
