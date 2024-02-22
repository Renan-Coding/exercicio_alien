// Aqui se define em uma variável as dimensões do jogo.
const larguraJogo = 700;
const alturaJogo = 850;

// Nessa parte, define o tipo do jogo, aplica as dimensões e cria as funções de preload, create e update.
const config = {
  type: Phaser.AUTO,
  width: larguraJogo, //Largura do jogo
  height: alturaJogo, //Altura do jogo

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 }, // Define a gravidade do jogo como 300.
      debug: true, // Ativa a hitbox para visualizar as colisões.
    },
  },

  scene: {
    preload: preload, // Pré-carregamento de recursos.
    create: create, // Criação dos elementos do jogo.
    update: update, // Atualização do jogo.
  },
};

// Cria o jogo.
const game = new Phaser.Game(config);

var alien; // Variável do sprite do alien.
var teclado; // Variável das teclas do teclado.
var turbo; // Variável do sprite do turbo.
var plataforma; // Variável do sprite da plataforma.
var moeda; // Variável do sprite da moeda.
var pontuacao = -1; // Variável da pontuação do jogador.
var placar; // Variável do texto do placar.
var nave;
var bases = [plataforma, nave];

function preload() {
  this.load.image("bg", "assets/bg.png"); // Carrega o plano de fundo.
  this.load.image("player", "assets/alienigena.png"); // Carrega o personagem do alien.
  this.load.image("turbo", "assets/turbo.png"); // Carrega o fogo do turbo.
  this.load.image("plataforma", "assets/tijolos.png"); // Carrega a imagem da plataforma.
  this.load.image("moeda", "assets/moeda.png"); // Carrega a moeda.
  this.load.image("nave", "assets/planet-globe-96-favicon.png"); // Carrega uma nave.
}

function create() {
  //Adiciona a imagem de fundo com as dimensões pela metade.
  this.add.image(larguraJogo / 2, alturaJogo / 2, "bg");

  turbo = this.add.sprite(0, 0, "turbo"); // Adiciona o sprite do turbo.
  turbo.setVisible(false); // Define o turbo como invisível.

  alien = this.physics.add.sprite(larguraJogo / 2, 0, "player"); // Adiciona o sprite do alien.
  alien.setCollideWorldBounds(true); // Define que o alien colide com os limites da tela.
  teclado = this.input.keyboard.createCursorKeys(); // Cria as teclas do teclado.

  bases.push(this.physics.add.staticImage(
    larguraJogo / 3,
    alturaJogo / 1.5,
    "plataforma"
  )); // Adiciona a plataforma como um objeto estático.
  bases.push(this.physics.add.staticImage(550, 250, "nave")); // Adiciona a nave como um objeto estático.

  bases.forEach(bases => {
    this.physics.add.collider(alien, bases);
  }); 

  moeda = this.physics.add.sprite(larguraJogo / 2, 0, "moeda"); // Adiciona o sprite da moeda.
  moeda.setCollideWorldBounds(true); // Define que a moeda colide com os limites da tela.
  moeda.setBounce(0.7); // Define o quique da moeda.
  
  bases.forEach(bases => {
    this.physics.add.collider(moeda, bases);
  });
  
  placar = this.add.text(50, 100, "Moedas:" + pontuacao, {
    fontSize: "45px",
    fill: "#495613",
  }); // Adiciona o texto do placar com a pontuação atualizada.

  this.physics.add.overlap(alien, moeda, function () {
    moeda.setVisible(false); // Torna a moeda invisível.

    var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650); // Gera uma posição Y aleatória para a moeda.
    moeda.setPosition(posicaoMoeda_Y, 100); // Define a nova posição da moeda.

    pontuacao += 1; // Aumenta a pontuação.
    placar.setText("Moedas:" + pontuacao); // Atualiza o texto do placar com a nova pontuação.

    moeda.setVisible(true); // Torna a moeda visível novamente.
  });
}

function update() {
  if (teclado.left.isDown) {
    alien.setVelocityX(-180); // Define a velocidade do alien para a esquerda.
  } else if (teclado.right.isDown) {
    alien.setVelocityX(180); // Define a velocidade do alien para a direita.
  } else {
    alien.setVelocityX(0); // Define a velocidade do alien como zero.
  }

  if (teclado.up.isDown) {
    alien.setVelocityY(-180); // Define a velocidade do alien para cima.
    ativarTurbo();
  } else {
    semTurbo();
  }

  turbo.setPosition(alien.x, alien.y + alien.height / 2); // Define a posição do turbo em relação ao alien.
}

function ativarTurbo() {
  turbo.setVisible(true); // Torna o turbo visível.
}

function semTurbo() {
  turbo.setVisible(false); // Torna o turbo invisível.
}
