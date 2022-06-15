/* global Phaser */

// Copyright (c) 2022 Ava Venturino Kaitlyn Ip All rights reserved
//
// Created by: Ava Venturino & Kaitlyn Ip
// Created on: Jun 2022
// This file contains the JS functions for index.html

/**
 * This class is the Game Scene.
 */
class GameScene extends Phaser.Scene {
  /**
   * create an alien
   */
  createAlien() {
    const alienXLocation = Math.floor(Math.random() * 1920) + 1; // this will get a number between 1 and 1920
    let alienXVelocity = Math.floor(Math.random() * 50) + 1; // this will get a number between 1 and 50
    alienXVelocity *= Math.round(Math.random()) ? 1 : -1; // thiis will add minus sign in 50% of cases
    const anAlien = this.physics.add.sprite(alienXLocation, -100, "alien");
    anAlien.body.velocity.y = 200;
    anAlien.body.velocity.x = alienXVelocity;
    this.alienGroup.add(anAlien);
  }

  /**
   * This method is the constructor
   */
  constructor() {
    super({ key: "gameScene" });

    this.background = null;
    this.background2 = null;
    this.ship = null;
    this.fireMissile = false;
    this.score = 0;
    this.scoreText = null;

    this.scoreTextStyle = {
      font: "65px Ariel",
      fill: "#ffffff",
      align: "center",
    };
    this.gameOverTextStyle = {
      font: "65px Ariel",
      fill: "#ff0000",
      align: "center",
    };
  }

  /**
   * Can be defined on your own Scenes.
   * this method is called by the Scene Manager when the scene starts,
   * before preload() and create().
   * @param {object} data - Any data via ScenePlugin.add() or ScenePlugin.start().
   */
  init(data) {
    this.cameras.main.setBackgroundColor("#ffffff");
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to load assets.
   */
  preload() {
    console.log("Game Scene");
    //images
    this.load.image("starBackground", "assets/image (1).png");
    this.load.image("ship", "assets/oie_8185832gsYBY41F-removebg-preview.png");
    this.load.image("missile", "assets/explosion.png");
    this.load.image("alien", "assets/8-ElQE9w-removebg-preview.png");
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to create your game objects.
   * @param {object} data - Any data via ScenePlugin.add() or ScenePlugin.start().
   */
  create(data) {
    this.background = this.add.image(0, 0, "starBackground").setScale(2.0);
    this.background.setOrigin(0, 0);
    this.background2 = this.add
      .image(1920 * 2, 0, "starBackground")
      .setScale(2.0);
    this.background2.setOrigin(0, 0);

    this.scoreText = this.add.text(
      100,
      100,
      "Score: " + this.score.toString(),
      this.scoreTextStyle
    );

    this.ship = this.physics.add.sprite(1920 / 6, 1080 - 200, "ship");

    // create a group for the missiles
    this.missileGroup = this.physics.add.group();

    // create a group for the aliens
    this.alienGroup = this.add.group();
    this.createAlien();

    //Collisions between missiles and aliens
    this.physics.add.collider(
      this.missileGroup,
      this.alienGroup,
      function (missileCollide, alienCollide) {
        alienCollide.destroy();
        missileCollide.destroy();
        this.score = this.score + 1;
        this.scoreText.setText("Score: " + this.score.toString());
        this.createAlien();
        this.createAlien();
      }.bind(this)
    );

    // Collisions between ship and aliens
    this.physics.add.collider(
      this.ship,
      this.alienGroup,
      function (shipCollide, alienCollide) {
        this.physics.pause();
        alienCollide.destroy();
        shipCollide.destroy();
        this.gameOverText = this.add
          .text(
            1920 / 2,
            1080 / 2,
            "Game Over!\nClick to play again.",
            this.gameOverTextStyle
          )
          .setOrigin(0.5);
        this.gameOverText.setInteractive({ userHandCursor: true });
        this.gameOverText.on("pointerdown", () =>
          this.scene.start("gameScene")
        );
      }.bind(this)
    );
  }

  /**
   * Should be overridden by your own Scenes.
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time.
   * @param {number} delta - The delta time in ms since the last frame.
   */
  update(time, delta) {
    // called 60 times a second, hopefully!

    const keyLeftObj = this.input.keyboard.addKey("LEFT");
    const keyRightObj = this.input.keyboard.addKey("RIGHT");
    const keyUpObj = this.input.keyboard.addKey("UP");
    const keyDownObj = this.input.keyboard.addKey("DOWN");
    const keySpaceObj = this.input.keyboard.addKey("SPACE");

    // move background each tick
    if (this.background.x >= -1920 * 2) {
      this.background.x = this.background.x - 2;
    } else {
      console.log("move background1");
      this.background.x = 1920 * 2;
    }
    if (this.background2.x >= -1920 * 2) {
      this.background2.x = this.background2.x - 2;
    } else {
      console.log("move background2");
      this.background2.x = 1920 * 2;
    }

    if (keyUpObj.isDown === true) {
      this.ship.y -= 15;
      if (this.ship.y < 0) {
        this.ship.y = 0;
      }
    }

    // Moves the character down
    if (keyDownObj.isDown === true) {
      this.ship.y += 15;
      if (this.ship.y > 1080) {
        this.ship.y = 1080;
      }
    }

    if (keySpaceObj.isDown === true) {
      if (this.fireMissile === false) {
        // fire missile
        this.fireMissile = true;
        const aNewMissile = this.physics.add.sprite(
          this.ship.x,
          this.ship.y,
          "missile"
        );
        this.missileGroup.add(aNewMissile);
      }
    }

    if (keySpaceObj.isUp === true) {
      this.fireMissile = false;
    }

    this.missileGroup.children.each(function (item) {
      item.x = item.x + 15;
      if (item.x < 0) {
        item.destroy();
      }
    });
  }
}
export default GameScene;
