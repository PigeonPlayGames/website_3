// Ensure the SQUARIFIC namespace exists
var SQUARIFIC = SQUARIFIC || {};
SQUARIFIC.framework = SQUARIFIC.framework || {};

// Placeholder for TouchControl constructor if not already defined
SQUARIFIC.framework.TouchControl = SQUARIFIC.framework.TouchControl || function(element, options) {
    // Implement touch control logic or integrate an existing solution
    console.log("TouchControl initialized for", element, "with options", options);
};

// Define the TouchControlDemo function
SQUARIFIC.TouchControlDemo = function(elem, name, settings) {
    "use strict";
    var self = this;
    var Player;

    settings = settings || {};
    settings.player = settings.player || {};

    // Define the Player constructor
    Player = function(elem, settings) {
        var selfPlayer = this;
        var joystick;
        var keysPressed = [];
        this.x = 0;
        this.y = 0;
        this.lastUpdate = Date.now();

        settings.width = settings.width || 49; // Default player width
        settings.height = settings.height || 63; // Default player height
        settings.moveSpeed = settings.moveSpeed || 0.12; // Default move speed

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

            selfPlayer.update();
        };

        this.update = function() {
            var now = Date.now();
            var timePassed = (now - selfPlayer.lastUpdate) / 1000;
            selfPlayer.lastUpdate = now;

            keysPressed.forEach(function(keyCode) {
                switch (keyCode) {
                    case 37: // Left
                        selfPlayer.x -= settings.moveSpeed * timePassed * 100;
                        break;
                    case 38: // Up
                        selfPlayer.y -= settings.moveSpeed * timePassed * 100;
                        break;
                    case 39: // Right
                        selfPlayer.x += settings.moveSpeed * timePassed * 100;
                        break;
                    case 40: // Down
                        selfPlayer.y += settings.moveSpeed * timePassed * 100;
                        break;
                }
            });

            selfPlayer.x = Math.max(0, Math.min(selfPlayer.x, settings.fieldWidth - settings.width));
            selfPlayer.y = Math.max(0, Math.min(selfPlayer.y, settings.fieldHeight - settings.height));

            selfPlayer.render();
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
        settings.width = elem.offsetWidth;
        settings.height = elem.offsetHeight;
        settings.player.fieldWidth = settings.width;
        settings.player.fieldHeight = settings.height;

        var playerElem = document.createElement('div');
        playerElem.className = 'player';
        elem.appendChild(playerElem);

        var joystickBackground = document.createElement('div');
        joystickBackground.className = 'joystickbackground';
        elem.appendChild(joystickBackground);

        var joystickHitzone = document.createElement('div');
        joystickHitzone.id = name + "_joystick";
        joystickHitzone.className = 'joystickhitzone';
        joystickBackground.appendChild(joystickHitzone);

        self.player = new Player(playerElem, settings.player);

        window.addEventListener("resize", function() {
            settings.width = elem.offsetWidth;
            settings.height = elem.offsetHeight;
            settings.player.fieldWidth = settings.width;
            settings.player.fieldHeight = settings.height;
            self.player.newFieldDim(settings.width, settings.height);
        });

        self.start();
    };

    this.start = function() {
        settings.run = true;
        self.loop();
    };

    this.loop = function() {
        if (settings.run) {
            self.player.update();
            window.requestAnimationFrame(self.loop);
        }
    };

    this.stop = function() {
        settings.run = false;
    };

    this.init();
};

// Initialize the TouchControlDemo
window.onload = function() {
    SQUARIFIC.touchControlDemo = new SQUARIFIC.TouchControlDemo(document.body, 'touchControlDemo', {});
};
