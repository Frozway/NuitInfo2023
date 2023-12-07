// 1. Initialisation des Variables Globales
var game, player, frontLeftIndicator, frontRightIndicator, cursors, islands;
var isUpdating = true;

var speed = 0;
var maxSpeed = 5;
var acceleration = 0.2;
var deceleration = 0.2;
var rotationSpeed = 0;
var maxRotationSpeed = 0.05;
var rotationAcceleration = 0.005;
var rotationDeceleration = 0.005;

// 2. Configuration de Phaser
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: { create: create, update: update },
    scale: { mode: Phaser.Scale.RESIZE, parent: 'phaser-example', width: '100%', height: '100%' }
};
game = new Phaser.Game(config);

// 3. Fonction `preload` (si nécessaire)

// 4. Fonction `create`
function create() {
    this.cameras.main.setBackgroundColor('#0000ff');
    this.physics.world.setBounds(0, 0, 2000, 2000);
    setupPlayer.call(this);
    setupIslands.call(this);
    setupCamera.call(this);
    setupControls.call(this);
}

// 5. Fonctions Auxiliaires pour `create`
function setupPlayer() {
    player = this.add.rectangle(1000, 1000, 100, 40, 0xffffff).setOrigin(0.5, 0.5);
    frontLeftIndicator = this.add.rectangle(player.x - 25, player.y - 25, 10, 10, 0x00ff00);
    frontRightIndicator = this.add.rectangle(player.x + 25, player.y - 25, 10, 10, 0xff0000);
}

function setupIslands() {
    // Ajouter des îles en tant qu'objets graphiques
    islands = [];
    var islandPositions = [[400, 400], [800, 200], [1200, 600], [1600, 300], [300, 1500]];
    for (let pos of islandPositions) {
        let island = this.add.rectangle(pos[0], pos[1], 100, 100, 0x00ff00); // Îles vertes
        islands.push(island);
    }
}

function setupCamera() {
    var camera = this.cameras.main;
    camera.startFollow(player, true, 0.05, 0.05);
    camera.setDeadzone(window.innerWidth / 4, window.innerHeight / 4);
    camera.setBounds(0, 0, 2000, 2000);
}

function setupControls() {
    cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
}

// 6. Fonction `update`
function update() {
    if (!isUpdating) {
        return;
    }

    handlePlayerMovement.call(this);
    handleCollision.call(this);
}

// 7. Fonctions Auxiliaires pour `update`

function handleCollision() {
    let isNearIsland = false;

    islands.forEach((island, index) => {
        let distance = Phaser.Math.Distance.Between(player.x, player.y, island.x, island.y);
        if (distance < 50 + 25) { // Collision directe
            console.log("Collision avec une île !");
            showIslandPopup(index); // Passer l'index de l'île
            isUpdating = false;
            console.log(index)
            isNearIsland = true;
            return; // Sortir de la boucle forEach
        } else if (distance < 50 + 100) { // Zone tampon
            isNearIsland = true;
            speed = Math.max(speed - deceleration, 1); // Ralentir le bateau
        }
    });

    if (!isNearIsland) {
        // Gestion de l'avancement
        if (cursors.up.isDown) {
            speed = Math.min(speed + acceleration, maxSpeed);
        } else {
            speed = Math.max(speed - deceleration, 0);
        }
    }
}

function adjustPlayerPosition(player, island) {
    // Logique pour ajuster la position du joueur après collision
    // ... (implémentez la logique selon vos besoins)
}

function handlePlayerMovement() {
    // Gestion de l'avancement
    if (cursors.up.isDown) {
        speed = Math.min(speed + acceleration, maxSpeed);
    } else {
        speed = Math.max(speed - deceleration, 0);
    }

    // Gestion de la rotation
    if (cursors.left.isDown) {
        rotationSpeed = Math.max(rotationSpeed - rotationAcceleration, -maxRotationSpeed);
    } else if (cursors.right.isDown) {
        rotationSpeed = Math.min(rotationSpeed + rotationAcceleration, maxRotationSpeed);
    } else {
        rotationSpeed = adjustRotationSpeed(rotationSpeed);
    }

    // Appliquer la rotation et le mouvement
    player.rotation += rotationSpeed;
    player.x += speed * Math.cos(player.rotation);
    player.y += speed * Math.sin(player.rotation);

    // Gestion des limites de la carte
    player.x = Phaser.Math.Clamp(player.x, 50, 1950); // 50 et 1950 prennent en compte la moitié de la largeur du bateau
    player.y = Phaser.Math.Clamp(player.y, 50, 1950); // 50 et 1950 prennent en compte la moitié de la hauteur du bateau

    // Mise à jour des indicateurs
    updateIndicators();
}

function adjustRotationSpeed(rotationSpeed) {
    if (rotationSpeed > 0) {
        return Math.max(rotationSpeed - rotationDeceleration, 0);
    } else if (rotationSpeed < 0) {
        return Math.min(rotationSpeed + rotationDeceleration, 0);
    }
    return rotationSpeed;
}

function updateIndicators() {
    frontLeftIndicator.x = player.x - 25 * Math.cos(player.rotation - Math.PI / 2);
    frontLeftIndicator.y = player.y - 25 * Math.sin(player.rotation - Math.PI / 2);
 
    frontRightIndicator.x = player.x + 25 * Math.cos(player.rotation - Math.PI / 2);
    frontRightIndicator.y = player.y + 25 * Math.sin(player.rotation - Math.PI / 2);
}


function showIslandPopup(islandIndex) {
    // Utiliser l'index pour identifier l'île spécifique et afficher le popup correspondant
    // Par exemple, en utilisant un tableau de noms ou d'identifiants pour vos îles
    let islandId = "island" + islandIndex; // Exemple de formation d'ID

    let popup = document.getElementById("popup-" + islandId);
    popup.style.display = "block";

    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}

function hideIslandPopup(popupId) {
    let popup = document.getElementById(popupId);
    popup.style.display = "none";

    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";

    console.log("Popup fermé !");
}