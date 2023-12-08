// 1. Initialisation des Variables Globales
var game, player, cursors, islands, themeSwitch;
var isUpdating = true;

var lastThemeChangeTime = 0;
var themeChangeDelay = 3000; // Délai en millisecondes, par exemple 1000 ms pour 1 seconde

var currentTheme = 'normal';

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
    this.load.image('badPlayerImage', 'assets/boatvfquipue.png');
    this.load.image('seaImage', 'assets/sea.png');
    this.load.image('badSeaImage', 'assets/seaquipue.png');
    this.load.image('island1', 'assets/ile1.png');
    this.load.image('island2', 'assets/ile2.png');
    this.load.image('island3', 'assets/ile3.png');
    this.load.image('island4', 'assets/ile4.png');
    this.load.image('badisland1', 'assets/ile1quipue.png');
    this.load.image('badisland2', 'assets/ile2quipue.png');
    this.load.image('badisland3', 'assets/ile3quipue.png');
    this.load.image('badisland4', 'assets/ile4quipue.png');
    this.load.image('badisland5', 'assets/ile5quipue.png');
    this.load.image('dophin', 'assets/dophin.png');
    this.load.image('badBaril', 'assets/barilquipue.png');
}

// 4. Fonction `create`
var seaSprites = []; // Tableau pour stocker les sprites de la mer

function create() {
    this.cameras.main.setBackgroundColor('#0000ff');
    this.physics.world.setBounds(0, 0, 2000, 2000);

    // Taille de la case
    const caseSize = 500;

    // Remplir la carte avec des sprites de mer
    for (let x = 0; x < 2000; x += caseSize) {
        for (let y = 0; y < 2000; y += caseSize) {
            const seaSprite = this.add.sprite(x, y, 'seaImage').setOrigin(0, 0);
            seaSprite.setScale(caseSize / seaSprite.width, caseSize / seaSprite.height);
            seaSprites.push(seaSprite); // Ajouter le sprite au tableau
        }
    }

    // Créer le baril de la mort
    themeSwitch = this.physics.add.sprite(750, 750, 'badBaril').setOrigin(0.5, 0.5);
    themeSwitch.setScale(50 / themeSwitch.width, 50 / themeSwitch.height);

    
    setupIslands.call(this);
    setupPlayer.call(this);
    setupCamera.call(this);
    setupControls.call(this);

    this.physics.add.collider(player, themeSwitch, function() {
        var currentTime = Date.now();
    
        if (currentTime - lastThemeChangeTime > themeChangeDelay) {
            switchTheme();
            lastThemeChangeTime = currentTime;
        }
    });

    this.physics.add.collider(player, islands, function(player, island) {
        handleIslandCollision(island);
    });
}


// 5. Fonctions Auxiliaires pour `create`
function setupPlayer() {
    // Créer un sprite pour le joueur en utilisant l'image chargée
    player = this.physics.add.sprite(1000, 1000, 'playerImage').setOrigin(0.5, 0.5);
    
    // Si vous souhaitez redimensionner l'image pour correspondre à la taille de votre ancien rectangle :
    player.setScale(100 / player.width, 40 / player.height); // Ajustez ces valeurs selon les dimensions souhaitées
}

function setupIslands() {
    islands = this.physics.add.staticGroup();
    var islandPositions = [[1000, 500], [500, 750], [1500, 750], [1250, 1250], [750, 1250]];
    var islandImages = ['island1', 'island2', 'island3', 'island4', 'island3'];

    for (let i = 0; i < islandPositions.length; i++) {
        let pos = islandPositions[i];
        let islandImage = islandImages[i];
        let island = islands.create(pos[0], pos[1], islandImage).setOrigin(0.5, 0.5);
    }
}


function switchPlayerTexture() {
    let newTexture = (currentTheme === "normal") ? 'playerImage' : 'badPlayerImage';
    player.setTexture(newTexture);

    // Ajuster l'échelle du sprite pour le thème "bad"
    if (currentTheme === "bad") {
        // Supposons que vous voulez agrandir le sprite de 50% pour le thème "bad"
        player.setScale(1.5 * (100 / player.width), 1.5 * (40 / player.height));
    } else {
        // Remettre à l'échelle normale pour le thème "normal"
        player.setScale(100 / player.width, 40 / player.height);
    }
}


function switchIslandTextures() {
    let newImages;

    if (currentTheme === 'normal') {
        newImages = ['island1', 'island2', 'island3', 'island4', 'island3'];
    } else {
        newImages = ['badisland1', 'badisland2', 'badisland3', 'badisland4', 'badisland5'];
    }

    islands.getChildren().forEach((island, index) => {
        island.setTexture(newImages[index]);
    });
}

function switchSeaTextures() {
    const newTexture = (currentTheme === "normal") ? 'seaImage' : 'badSeaImage';

    seaSprites.forEach(sprite => {
        sprite.setTexture(newTexture);
    });
}

function switchBarilTexture() {
    currentTheme === 'normal' ? themeSwitch.setTexture('badBaril') : themeSwitch.setTexture('dophin');
    themeSwitch.setScale(50 / themeSwitch.width, 50 / themeSwitch.height);
}

function switchTheme() {
    if(currentTheme === 'normal') {
        currentTheme = 'bad';
    }
    else {
        currentTheme = 'normal';
    }
    switchIslandTextures();
    switchSeaTextures();
    switchPlayerTexture();
    switchBarilTexture();
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
}

// 7. Fonctions Auxiliaires pour `update`
function handleIslandCollision(island){
    speed = 0;
    isUpdating = false;
    let islandIndex = islands.getChildren().indexOf(island);
    showIslandPopup(islandIndex);
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