var SQUARIFIC = SQUARIFIC || {};
SQUARIFIC.framework = SQUARIFIC.framework || {};

// Placeholder for TouchControl constructor if not already defined
SQUARIFIC.framework.TouchControl = SQUARIFIC.framework.TouchControl || function(element, options) {
    // Implement touch control logic or integrate an existing solution
    console.log("TouchControl initialized for", element, "with options", options);
};

SQUARIFIC.TouchControlDemo = function(elem, name, settings) {
    "use strict";
    var self = this;
    var Player;

    if (!settings) {
        settings = {};
    }
    if (!settings.player) {
        settings.player = {};
    }

    Player = function(elem, settings) {
        var selfPlayer = this;
        var joystick;
        var keysPressed = [];
        this.x = 0;
        this.y = 0;
        this.lastUpdate = Date.now();

        // Basic validation and default settings
        settings.width = isNaN(settings.width) ? 49 : settings.width;
        settings.height = isNaN(settings.height) ? 63 : settings.height;
        settings.moveSpeed = isNaN(settings.moveSpeed) ? 0.12 : settings.moveSpeed;

        this.init = function() {
            if (SQUARIFIC.framework && SQUARIFIC.framework.TouchControl) {
                joystick = new SQUARIFIC.framework.TouchControl(document.getElementById(name + "_joystick"), {
                    pretendArrowKeys: true,
                    mindistance: 25,
                    maxdistance: 75,
                    middleLeft: 25,
                    middleTop: 25
                });

                joystick.on("pretendKeydown", selfPlayer.handleKeyDown);
                joystick.on("pretendKeyup", selfPlayer.handleKeyUp);
            } else {
                console.error("Framework or TouchControl not available");
            }

            document.addEventListener("keydown", selfPlayer.handleKeyDown);
            document.addEventListener("keyup", selfPlayer.handleKeyUp);

            elem.style.position = "absolute";
            elem.style.width = settings.width + "px";
            elem.style.height = settings.height + "px";
            selfPlayer.x = (settings.fieldWidth - settings.width) / 2;
            selfPlayer.y = (settings.fieldHeight - settings.height) / 2;
        };

        this.newFieldDim = function(width, height) {
            settings.fieldWidth = width;
            settings.fieldHeight = height;
        };

        this.update = function() {
            var now = Date.now();
            var timePassed = (now - selfPlayer.lastUpdate) / 1000;
            selfPlayer.lastUpdate = now;

            keysPressed.forEach(function(keyCode) {
                switch (keyCode) {
                    case 37: // Left
                        selfPlayer.x -= settings.moveSpeed * timePassed;
                        break;
                    case 38: // Up
                        selfPlayer.y -= settings.moveSpeed * timePassed;
                        break;
                    case 39: // Right
                        selfPlayer.x += settings.moveSpeed * timePassed;
                        break;
                    case 40: // Down
                        selfPlayer.y += settings.moveSpeed * timePassed;
                        break;
                }
            });

            // Boundary checks
            selfPlayer.x = Math.max(0, Math.min(selfPlayer.x, settings.fieldWidth - settings.width));
            selfPlayer.y = Math.max(0, Math.min(selfPlayer.y, settings.fieldHeight - settings.height));
        };

        this.render = function() {
            elem.style.left = selfPlayer.x + "px";
            elem.style.top = selfPlayer.y + "px";
        };

        this.handleKeyDown = function(event) {
            if (keysPressed.indexOf(event.keyCode) === -1) {
                keysPressed.push(event.keyCode);
            }
        };

        this.handleKeyUp = function(event) {
            var index = keysPressed.indexOf(event.keyCode);
            if (index !== -1) {
                keysPressed.splice(index, 1);
            }
        };

        this.init();
    };

    this.init = function() {
        var playerElem = document.createElement("div");
        playerElem.id = name + "_player";
        elem.appendChild(playerElem);

        settings.player.fieldWidth = elem.offsetWidth;
        settings.player.fieldHeight = elem.offsetHeight;

        self.player = new Player(playerElem, settings.player);

        window.addEventListener("resize", function() {
            var newWidth = elem.offsetWidth;
            var newHeight = elem.offsetHeight;
            if (self.player) {
                self.player.newFieldDim(newWidth, newHeight);
            }
        });

        self.start();
    };

    this.loop = function() {
        self.update();
        self.render();
        if (settings.run) {
            window.requestAnimationFrame(self.loop);
        }
    };

    this.update = function() {
        self.player.update();
    };

    this.render = function() {
        self.player.render();
    };

    this.start = function() {
        if (!settings.run) {
            settings.run = true;
            window.requestAnimationFrame(self.loop);
        }
    };

    this.stop = function() {
        settings.run = false;
    };

    this.init();
};

// Example initialization
// Assuming you have an HTML element with ID "gameArea" and you want to name your touch control "myGameTouchControl"
window.onload = function() {
    var gameArea = document.getElementById("gameArea");
    var touchControlDemo = new SQUARIFIC.TouchControlDemo(gameArea, "myGameTouchControl", {});
};
