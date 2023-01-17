import { Entity } from "./lib/Entity";
import { Game } from "./lib/Game";
import { Player } from "./Player";
import { Snake } from "./Snake";

const game = new Game("Snake");
game.instantiateEntity(Snake);
game.start();

export {};
