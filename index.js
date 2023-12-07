var game;
var player;
var frontLeftIndicator;
var frontRightIndicator;
var cursors;
var islands;

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // Largeur initiale basée sur la fenêtre du navigateur
    height: window.innerHeight, // Hauteur initiale basée sur la fenêtre du navigateur
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE, // Mode de redimensionnement
        parent: 'phaser-example', // ID du parent DOM (si nécessaire)
        width: '100%', // Largeur en pourcentage
        height: '100%' // Hauteur en pourcentage
    }
};


var game = new Phaser.Game(config);

var player;
var frontLeftIndicator;
var frontRightIndicator;

function create() {
    // Couleur de fond bleue pour la carte
    this.cameras.main.setBackgroundColor('#0000ff');

    // Définir la taille du monde
    this.physics.world.setBounds(0, 0, 2000, 2000);

    // Dessiner la grille
    var graphics = this.add.graphics({ lineStyle: { width: 1, color: 0xaaaaaa } });
    var gridSize = 100;
    for (var x = 0; x <= 2000; x += gridSize) {
        graphics.lineBetween(x, 0, x, 2000);
    }
    for (var y = 0; y <= 2000; y += gridSize) {
        graphics.lineBetween(0, y, 2000, y);
    }

    // Créer le bateau (joueur)
    player = this.add.rectangle(1000, 1000, 100, 40, 0xffffff);
    player.setOrigin(0.5, 0.5);
 
    // Activer la physique pour les indicateurs de direction
    frontLeftIndicator = this.add.rectangle(player.x - 25, player.y - 25, 10, 10, 0x00ff00);
    frontRightIndicator = this.add.rectangle(player.x + 25, player.y - 25, 10, 10, 0xff0000);

    // Créer un groupe pour les îles
    islands = this.physics.add.staticGroup();

    // Ajouter des îles en tant qu'objets graphiques
    islands = [];
    var islandPositions = [[400, 400], [800, 200], [1200, 600], [1600, 300], [300, 1500]];
    for (let pos of islandPositions) {
        let island = this.add.rectangle(pos[0], pos[1], 100, 100, 0x00ff00); // Îles vertes
        islands.push(island);
    }

    // Ajouter une détection de collision entre le bateau et les îles
    this.physics.add.collider(player, islands, function() {
        console.log("Le bateau est proche d'une île !");
        // Ici, vous pouvez ajouter une logique supplémentaire, comme afficher une notification
    });
 
    // Contrôles
    cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
 
    // Définir la caméra pour suivre le joueur avec une zone morte
    let camera = this.cameras.main;
    camera.startFollow(player, true, 0.05, 0.05);
    camera.setDeadzone(window.innerWidth / 4, window.innerHeight / 4);

    // Limiter la vue de la caméra à la taille du monde
    camera.setBounds(0, 0, 2000, 2000);
}

var speed = 0;
var maxSpeed = 5;
var acceleration = 0.2;
var deceleration = 0.2;
var rotationSpeed = 0;
var maxRotationSpeed = 0.05;
var rotationAcceleration = 0.005;
var rotationDeceleration = 0.005;

function update() {
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
        if (rotationSpeed > 0) {
            rotationSpeed = Math.max(rotationSpeed - rotationDeceleration, 0);
        } else if (rotationSpeed < 0) {
            rotationSpeed = Math.min(rotationSpeed + rotationDeceleration, 0);
        }
    }

    // Appliquer la rotation
    player.rotation += rotationSpeed;

    // Appliquer le mouvement
    player.x += speed * Math.cos(player.rotation);
    player.y += speed * Math.sin(player.rotation);

    // Gestion des limites de la carte
    player.x = Phaser.Math.Clamp(player.x, 50, 1950); // 50 et 1950 prennent en compte la moitié de la largeur du bateau
    player.y = Phaser.Math.Clamp(player.y, 50, 1950); // 50 et 1950 prennent en compte la moitié de la hauteur du bateau

    // Mettre à jour la position des indicateurs
    frontLeftIndicator.x = player.x - 25 * Math.cos(player.rotation - Math.PI / 2);
    frontLeftIndicator.y = player.y - 25 * Math.sin(player.rotation - Math.PI / 2);
 
    frontRightIndicator.x = player.x + 25 * Math.cos(player.rotation - Math.PI / 2);
    frontRightIndicator.y = player.y + 25 * Math.sin(player.rotation - Math.PI / 2);

    let isNearIsland = false;

    // Gestion manuelle des collisions avec les îles
    for (let island of islands) {
        let distance = Phaser.Math.Distance.Between(player.x, player.y, island.x, island.y);
        if (distance < 50 + 25) { // Collision directe
            console.log("Collision avec une île !");
            speed = 0;
            isNearIsland = true;
            break;
        } else if (distance < 50 + 100) { // Zone tampon
            isNearIsland = true;
            speed = Math.max(speed - deceleration, 1); // Ralentir le bateau
        }
    }

    if (!isNearIsland) {
        // Gestion de l'avancement
        if (cursors.up.isDown) {
            speed = Math.min(speed + acceleration, maxSpeed);
        } else {
            speed = Math.max(speed - deceleration, 0);
        }
    }

    // Gestionnaire de redimensionnement
    var resize = () => {
        this.scale.resize(window.innerWidth, window.innerHeight);
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('resize', resize);
}