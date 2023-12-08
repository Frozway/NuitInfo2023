// 1. Initialisation des Variables Globales
var game, player, cursors, islands;
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
    scene: { preload: preload, create: create, update: update },
    scale: { mode: Phaser.Scale.RESIZE, parent: 'phaser-example', width: '100%', height: '100%' }
};
game = new Phaser.Game(config);

// 3. Fonction `preload` (si nécessaire)
function preload() {
    // Le premier argument est l'identifiant de l'image, et le second est le chemin de l'image
    this.load.image('playerImage', 'assets/boatvf.png');
    this.load.image('seaImage', 'assets/sea.png');
    this.load.image('island1', 'assets/axe1.png');
    this.load.image('island2', 'assets/axe2.png');
    this.load.image('island3', 'assets/axe3.png');
    this.load.image('island4', 'assets/axe4.png');
    this.load.image('island5', 'assets/axe5.png');
}


// 4. Fonction `create`
function create() {
    this.cameras.main.setBackgroundColor('#0000ff');
    this.physics.world.setBounds(0, 0, 2000, 2000);

    // Taille de la case
    const caseSize = 500;

    // Remplir la carte avec des sprites de mer
    for (let x = 0; x < 2000; x += caseSize) {
        for (let y = 0; y < 2000; y += caseSize) {
            const seaSprite = this.add.sprite(x, y, 'seaImage').setOrigin(0, 0);

            // Ajuster l'échelle du sprite
            // Remplacer 'originalWidth' et 'originalHeight' par les dimensions réelles de l'image 'sea.png'
            seaSprite.setScale(caseSize / seaSprite.width, caseSize / seaSprite.height);
        }
    }

    setupPlayer.call(this);
    setupIslands.call(this);
    setupCamera.call(this);
    setupControls.call(this);
}

// 5. Fonctions Auxiliaires pour `create`
function setupPlayer() {
    // Créer un sprite pour le joueur en utilisant l'image chargée
    player = this.physics.add.sprite(1000, 1000, 'playerImage').setOrigin(0.5, 0.5);
    
    // Si vous souhaitez redimensionner l'image pour correspondre à la taille de votre ancien rectangle :
    player.setScale(100 / player.width, 40 / player.height); // Ajustez ces valeurs selon les dimensions souhaitées
}

function setupIslands() {
    islands = [];
    var islandPositions = [[1000, 500], [500, 750], [1500, 750], [1250, 1250], [750, 1250]];
    var islandImages = ['island1', 'island2', 'island3', 'island4', 'island5'];

    for (let i = 0; i < islandPositions.length; i++) {
        let pos = islandPositions[i];
        let islandImage = islandImages[i];
        let island = this.add.sprite(pos[0], pos[1], islandImage).setOrigin(0.5, 0.5);
        islands.push(island);
    }
}

// Fonction pour récupérer les positions des îles sur la fenêtre en temps réel et pas en dur
function getIslandsPositions() {
    return islands.map(island => ({
        x: island.x,
        y: island.y
    }));
}

// Fonction pour placer des liens sur les îles avec des numéros cliquables vers des URL
function placeLinksOnIslands(playerX, playerY) {
    // Supprimer les anciens liens pour éviter les doublons
    var existingLinks = document.querySelectorAll('.island-link');
    existingLinks.forEach(link => link.remove());

    // Créer des liens pour chaque île
    getIslandsPositions(playerX, playerY).forEach((position, index) => {
        // Créer le lien
        var link = document.createElement('a');
        link.className = 'island-link';
        link.textContent = 'Ile ' + (index + 1); // Marquer le lien avec le numéro de l'île

            // Positionner le lien
            link.style.position = 'absolute';
            link.style.left = position.x + 'px';
            link.style.top = position.y + 'px';
        

        // Définir l'URL de redirection pour chaque île
        var islandURLs = [
            'https://example.com/ile1',
            'https://example.com/ile2',
            'https://example.com/ile3',
            'https://example.com/ile4',
            'https://example.com/ile5'
        ];  
        link.href = islandURLs[index];

        // Ajouter le lien au corps du document
        document.body.appendChild(link);
    });
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

    // Mettre à jour les liens sur les îles
    placeLinksOnIslands();
}

// 7. Fonctions Auxiliaires pour `update`

function handleCollision() {
    let isNearIsland = false;

    islands.forEach((island, index) => {
        let distance = Phaser.Math.Distance.Between(player.x, player.y, island.x, island.y);
        if (distance < 50 + 100) { // Collision directe
            console.log("Collision avec une île !");
            isUpdating = false;
            console.log(index)
            isNearIsland = true;
            return; // Sortir de la boucle forEach
        } else if (distance < 50 + 150) { // Zone tampon
            showIslandPopup(index); // Passer l'index de l'île
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

function adjustPlayerPosition() {
    player.x = 1000;
    player.y = 1000;
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

}

function adjustRotationSpeed(rotationSpeed) {
    if (rotationSpeed > 0) {
        return Math.max(rotationSpeed - rotationDeceleration, 0);
    } else if (rotationSpeed < 0) {
        return Math.min(rotationSpeed + rotationDeceleration, 0);
    }
    return rotationSpeed;
}


function showIslandPopup(islandIndex) {
    // Utiliser l'index pour identifier l'île spécifique et afficher le popup correspondant
    // Par exemple, en utilisant un tableau de noms ou d'identifiants pour vos îles
    
    let popupId = parseInt(islandIndex) + 1;
    popupId = "popup-island" + popupId; // Exemple de formation d'ID

    let popup = document.getElementById(popupId);
    console.log(popupId);
    popup.style.display = "flex";

    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}

function hideIslandPopup(popupId) {
    let popup = document.getElementById(popupId);
    popup.style.display = "none";

    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";

    adjustPlayerPosition(player, popupId);
    isUpdating = true;
    
    console.log("Popup fermé !");
}