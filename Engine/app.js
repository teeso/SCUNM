﻿var game = {
	state: { //game state data, this data will be loaded/saved for every command for every player
		currentRoom: "Start Gate",
		inventory: null,
		rooms: {
			"A Fountain": { doorOpened: false }
		},
		interactives: {
			bonfire: {
				extinguished: false
			},
			bottle: {
				filled: false,
				collectible: true
			},
			key: {
				visible: false,
				collectible: false
			}
		}
	},//end game state
	//game assets
	globalResources: {
		images: {
			TitleImage: "http://gameimages/myGame/Title.gif"
		},
		actions: {
			extinguish: {
				description: "A dense cloud of steam raises when you throw the water into the bonfire.",
				image: "http://gameimages/myGame/ExtinguishingBonfire.gif"  //animated gif
			},
			fillBottle: {
				description: "You fill the bottle with the water of the fountain.",
				image: "http://gameimages/myGame/fillBottle.gif"  //animated gif
			},
			hotKey: {
				description: "Auch! The key is too hot.You can not do that",
			},
			doorClosed: {
				description: "The door of the mansion is key locked."
			}
		},
		interactives: {
		}
	},
	rooms: {
		"Start Gate": {
			name: "Start Gate",
			descriptions: {
				0: "You are on the other side of a burnt broken bridge, you look back to see the debris and a steady stream of water. There is an abandoned camp with a still active bonfire on the side of the road.",
				1: "You are on the other side of a burnt broken bridge, you look back to see the debris and a steady stream of water. There is an abandoned camp with a extinguished bonfire on the side of the road."
			},
			images: {
				0: "http://gameimages/myGame/StartGate.gif",
				1: "http://gameimages/myGame/StartGateExtinguished.gif"
			},
			interactives: {
				bonfire: {
					name: "Bonfire",
					descriptions: {
						0: "A pretty hot bonfire. Looks like a key shines among the embers.",
						1: "A extinguished bonfire." //once you use the water to extinguish it
					},
					images: {
						0: "http://gameimages/myGame/bonfire.gif",
						1: "http://gameimages/myGame/extinguishedBonfire.gif"
					},
					extinguish: function () {
						this.state.extinguished = true;
						this.state.descriptionIndex = 1;
						this.state.imageIndex = 1;
					},
					"look at": function () {
						game.interactiveGetFromCurrentRoom("key").state.visible = true;
					},
					use: function (game, item) {
						if (item.id == "bottle") {
							this.extinguish();
							item.empty();
							game.interactiveGetFromCurrentRoom("key").state.collectible = true;
						}
					}
				},
				key: {
					name: "Copper key",
					descriptions: {
						0: "A copper key."
					},
					images: {
						0: "http://gameimages/myGame/copperKey.gif"
					},
					"pick up": function (game) {
						var out = this.state.collectible ? game.roomGetCurrent().keyPickedUp() : game.outPutCreateFromAction("hotKey");
						return out;
					}
				}
			},
			exits: {
				north: "A Fountain",
				east: null,
				south: null,
				west: null
			},
			keyPickedUp: function () {
				this.state.descriptionIndex = 1;
				this.state.imageIndex = 1;
			}
		},
		"A Fountain": {
			name: "A Fountain",
			descriptions: {
				0: "You are near a fountain. It is in front of a huge mansion. There is a empty bottle just besides it",
				1: "You are near a fountain. It is in front of a huge mansion."//once you pick up the bottle
			},
			images: {
				0: "http://gameimages/myGame/AFountain.gif"
			},
			interactives: {
				bottle: {
					name: "Bottle",
					descriptions: {
						0: "It is a empyt bottle",
						1: "It is a bottle with some water" //once you fill the bottle in the fountain
					},
					images: {
						0: "http://gameimages/myGame/EmptyBottle.gif",
						1: "http://gameimages/myGame/WaterBottle.gif"
					},
					fill: function () {
						this.state.filled = true;
						this.state.descriptionIndex = 1;
						this.state.imageIndex = 1;
					},
					empty: function () {
						this.state.filled = false;
						this.state.descriptionIndex = 0;
						this.state.imageIndex = 0;
					},
					use: function (game, secondInteractive) {
						if (!secondInteractive) return;
						if (secondInteractive.id == "fountain") {
							this.fill();
							return game.outPutCreateFromAction("fillBottle");
						}
					},
				},
				fountain: {
					name: "Marble fountain",
					descriptions: {
						0: "A marble fountain with lots of water."
					},
					images: {
						0: "http://gameimages/myGame/fountain.gif"
					},
					use: function (game, secondInteractive) {
						if (!secondInteractive) return;
						if (secondInteractive.id == "bottle") {
							secondInteractive.fill();
							return game.outPutCreateFromAction("fillBottle");
						}
					},
				}
			},
			exits: {
				north: "Mansion",
				east: null,
				south: "Start Gate",
				west: null
			},
			bottlePickedUp: function () {
				this.state.descriptionIndex = 1;
			},
			go: function (game, direction) {
				if (direction == "north" && game.roomGetCurrent().state.doorOpened == false) {
					return game.outPutCreateFromAction("doorClosed");
				}
			},
			"pick up": function (game, interactive) {
				if (interactive.id = "bottle") {
					this.bottlePickedUp();
				}
			}
		},
		Mansion: {
			name: "Mansion",
			descriptions: {
				0: "You are in a huge mansion. Seems abandoned."
			},
			images: { 0: "http://gameimages/myGame/Mansion.gif" },
			exits: {
				north: null,
				east: null,
				south: "A Fountain",
				west: null
			}
		}
	}
};


//Inject Game API on init
game.roomGetCurrent = function () {
	var room = this.rooms[this.state.currentRoom];
	room.state = this.state.rooms[room.name];
	return room;
};

game.roomSetCurrent = function (destRoom) {
	this.state.currentRoom = destRoom;
};

game.roomGet = function (roomName) {
	var room = this.rooms[roomName];
	room.state = this.state.rooms[room.name];
	return room;
};

game.interactiveGetFromCurrentRoom = function (interactiveId) {
	interactive = this.roomGetCurrent().interactives[interactiveId];
	interactive.state = this.state.interactives[interactiveId];
	return interactive;
};

game.interactiveGetFromInventory = function (itemId) {
	return this.state.inventory[itemId];
};

game.outPutCreateRaw = function (text, imgURL, selection) {
	var game = this;
	var outPut = new Object();
	outPut.text = text;
	if (imgURL) outPut.imgURL = imgURL;
	if (selection) {
		outPut.selection = { command: selection.command, list: selection.list };
	}
	return outPut;
};

game.outPutCreateFromRoom = function (room) {
	var text = room.descriptions[room.state.descriptionIndex];
	var imgURL = room.images[room.state.imageIndex];
	return this.outPutCreateRaw(text, imgURL);
};

game.outPutCreateFromInteractive = function (entity) {
	var text = entity.descriptions[entity.state.descriptionIndex];
	var imgURL = entity.images[entity.state.imageIndex];
	return this.outPutCreateRaw(text, imgURL);
};

game.outPutCreateFromRoomInteractives = function (text, command, showInventory) {
	var currentGame = this;
	var room = this.roomGetCurrent();
	var list = Object.keys(room.interactives).filter(function (id) {
		var item = currentGame.interactiveGetFromCurrentRoom(id);
		return item.state.visible && !item.state.removed;
	}).map(function (id) {
		var item = game.interactiveGetFromCurrentRoom(id);
		return { id: id, name: item.name }
	});
	if (showInventory) list.push({ id: "inventory", name: "inventory" })
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.outPutCreateFromInventory = function (text, command) {
	var list = Object.keys(this.state.inventory).map(function (id) {
		var item = game.interactiveGetFromInventory(id);
		return { id: id, name: item.name }
	});
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.outPutCreateFromRoomExits = function (text, command) {
	var list = Object.keys(this.rooms[this.state.currentRoom].exits).map(function (id) {
		return { id: id, name: id }
	});;
	return this.outPutCreateRaw(text, null, { command: command, list: list });
};

game.outPutCreateFromAction = function (actionName) {
	var action = this.globalResources.actions[actionName];
	return this.outPutCreateRaw(action.description, action.image);
};

game.inventoryAddItem = function (item) {
	this.state.inventory[item.id] = item;
};

game.inventoryRemoveItem = function (item) {
	delete this.state.inventory[item.id];
};

game.resourceGet = function (name) { //i.e. "images.TitleImage"
	var resPath = name.split(".");
	var resource = this.globalResources;

	gerResource = function () {
		resource = resource[resPath[index]];
	};

	for (var index in resPath) {
		gerResource();
	}

	return resource;

};

game.globalCommands = new Object;

game.globalCommands.go = function (direction) {

	if (!direction) return this.outPutCreateFromRoomExits("Where to?", "go");//output list of directions

	var destRoom = this.roomGetCurrent().exits[direction];
	if (!destRoom) return this.outPutCreateRaw("No way to go...");

	var outPut = this["go"] ? this.go(direction) : null;
	if (outPut) return outPut;

	var room = this.roomGetCurrent();
	outPut = room["go"] ? room.go(this, direction) : null;
	if (outPut) return outPut;

	//default behaviour
	this.roomSetCurrent(destRoom);
	return this.outPutCreateFromRoom(this.roomGetCurrent());
};

game.globalCommands.inspect = function (itemId) {
	var item = this.interactiveGetFromInventory(itemId);
	if (item) return this.outPutCreateFromInteractive(item);
};

game.globalCommands.inventory = function () { return this.outPutCreateFromInventory("This is what you got:", "inspect"); };

game.globalCommands.use = function (firstInteractiveId, secondInteractiveId) {
	if (!firstInteractiveId) return this.outPutCreateFromRoomInteractives("Use what?", "use", true);

	if (firstInteractiveId == "inventory") { return this.outPutCreateFromInventory("Use what?", "use") };

	firstInteractive = this.interactiveGetFromCurrentRoom(firstInteractiveId) || this.interactiveGetFromInventory(firstInteractiveId);

	if (firstInteractive) {
		var outPut = this["use"] ? this["use"](firstInteractive) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["use"] ? room.use(this, firstInteractive) : null;
		if (outPut) return outPut;

		outPut = firstInteractive["use"] ? firstInteractive.use(this) : null;
		if (outPut) return outPut;

		if (!secondInteractiveId) return this.outPutCreateFromRoomInteractives("Use " + firstInteractive.name + " with what?", "use " + firstInteractive.name, true);

		if (secondInteractiveId == "inventory") { return this.outPutCreateFromInventory("Use " + firstInteractive.name + " with what?", "use " + firstInteractive.name) };

		secondInteractive = this.interactiveGetFromCurrentRoom(secondInteractiveId) || this.interactiveGetFromInventory(secondInteractiveId);

		if (secondInteractiveId) {
			var outPut = this["use"] ? this["use"](firstInteractive, secondInteractive) : null;
			if (outPut) return outPut;

			var room = this.roomGetCurrent();
			outPut = room["use"] ? room.use(this, firstInteractive, secondInteractive) : null;
			if (outPut) return outPut;

			outPut = firstInteractive["use"] ? firstInteractive.use(this, secondInteractive) : null;
			if (outPut) return outPut;

			return this.outPutCreateRaw("It does not work.");
		}
	}
};

game.globalCommands["look at"] = function (interactiveId) {
	if (!interactiveId) return this.outPutCreateFromRoomInteractives("Look at what?", "look at"); // ouput list of interactives

	var interactive = this.interactiveGetFromCurrentRoom(interactiveId);
	if (!interactive) return this.outPutCreateRaw("You can not see that.");

	var outPut = this["look at"] ? this["look at"](interactive) : null;
	if (outPut) return outPut;

	var room = this.roomGetCurrent();
	outPut = room["look at"] ? room["look at"](this, interactive) : null;
	if (outPut) return outPut;

	outPut = interactive["look at"] ? interactive["look at"](this) : null;
	if (outPut) return outPut;

	//default behaviour
	if (interactive.state.visible && !interactive.state.removed) {
		return this.outPutCreateFromInteractive(interactive);
	}
	return this.outPutCreateRaw("You can not see that.");
};

game.globalCommands["pick up"] = function (interactiveId) {
	{
		if (!interactiveId) return this.outPutCreateFromRoomInteractives("Pick up what?", "pick up"); //output list of interactives in the room

		var interactive = this.interactiveGetFromCurrentRoom(interactiveId);
		if (!interactive) return this.outPutCreateRaw("Nothing to pick up.");

		var outPut = this["pick up"] ? this["pick up"](interactive) : null;
		if (outPut) return outPut;

		var room = this.roomGetCurrent();
		outPut = room["pick up"] ? room["pick up"](this, interactive) : null;
		if (outPut) return outPut;

		outPut = interactive["pick up"] ? interactive["pick up"](this) : null;
		if (outPut) return outPut;

		//default behaviour
		if (!interactive.state.visible) return this.outPutCreateRaw("Nothing to pick up.");
		if (!interactive.state.collectible) return this.outPutCreateRaw("You can not pick up that ");
		this.inventoryAddItem(interactive);
		interactive.state.removed = true;
		return this.outPutCreateRaw("You picked up " + interactive.name);
	}
};

//game will be in memory always (TODO: make a engine for redis that allows just load in memory game assets needed for the task)

//engine for host

initGame = function (game) {
	initState(game);
	initIDs(game);
};

initIDs = function (game) {
	for (var roomName in game.rooms) {
		for (var interactiveID in game.rooms[roomName].interactives) {
			game.rooms[roomName].interactives[interactiveID].id = interactiveID;
		}
	}
};

initState = function (game) {
	game.state.inventory = new Object();
	for (var roomName in game.rooms) {

		var roomState = game.state.rooms[roomName];
		if (!roomState) {//not exist, create it
			roomState = {
				descriptionIndex: 0,
				imageIndex: 0
			};
			game.state.rooms[roomName] = roomState;
		}
		else {//add properties needed by the engine 
			roomState["descriptionIndex"] === undefined ? roomState.descriptionIndex = 0 : null;
			roomState["imageIndex"] === undefined ? roomState.imageIndex = 0 : null;
		}

		for (var interactiveName in game.rooms[roomName].interactives) {
			var itemState = game.state.interactives[interactiveName];
			if (!itemState) { //not exist, create it
				itemState = {
					descriptionIndex: 0,
					imageIndex: 0,
					visible: true,
					collectible: false,
					removed: false
				};
				game.state.interactives[interactiveName] = itemState;
			}
			else { //add properties needed by the engine 
				itemState["descriptionIndex"] === undefined ? itemState.descriptionIndex = 0 : null;
				itemState["imageIndex"] === undefined ? itemState.imageIndex = 0 : null;
				itemState["visible"] === undefined ? itemState.visible = true : null;
				itemState["collectible"] === undefined ? itemState.collectible = false : null;
				itemState["removed"] === undefined ? itemState.removed = false : null;
			}

		}
	}
};

execCommand = function (game, verb, dObject, iObject) {
	outPut = game.globalCommands[verb] ? game.globalCommands[verb].call(game, dObject, iObject) : { text: "What? Try again..." };
	return outPut;
};

start = function (game) {
	var currentRoom = game.roomGetCurrent();
	return {
		text: currentRoom.descriptions[currentRoom.state.descriptionIndex],
		imgUrl: currentRoom.images[currentRoom.state.imageIndex]
	};
};

var verbs = {
	go: null,
	use: null,
	"pick up": null,
	"look at": null,
	inventory: null
};

initGame(game);
var res;
console.log("> Commands: " + Object.keys(verbs).join(", ")); // this will be custom keyboard in telegram chat

console.log("start");
console.log("> " + start(game).text);

console.log("look at");
res = execCommand(game, "look at");
console.log("> " + res.text + " " + res.selection.list); // this will be inline buttons in telegram chat

console.log("look at key");
console.log("> " + execCommand(game, "look at", "key").text);

console.log("look at bonfire");
console.log("> " + execCommand(game, "look at", "bonfire").text);

console.log("look at key");
console.log("> " + execCommand(game, "look at", "key").text);

console.log("pick up");
res = execCommand(game, "pick up");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("pick up key");
console.log("> " + execCommand(game, "pick up", "key").text);

console.log("go");
res = execCommand(game, "go");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("go north");
console.log("> " + execCommand(game, "go", "north").text);

console.log("look at fountain");
console.log("> " + execCommand(game, "look at", "fountain").text);

console.log("look at bottle");
console.log("> " + execCommand(game, "look at", "bottle").text);

console.log("pick up bottle");
console.log("> " + execCommand(game, "pick up", "bottle").text);

console.log("inventory");
res = execCommand(game, "inventory");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("inspect bottle");
console.log("> " + execCommand(game, "inspect", "bottle").text);

console.log("go south");
console.log("> " + execCommand(game, "go", "south").text);

console.log("go north");
console.log("> " + execCommand(game, "go", "north").text);

console.log("use");
res = execCommand(game, "use");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("use fountain");
res = execCommand(game, "use", "fountain");
console.log("> " + res.text ); // this will be inline buttons in telegram chat

console.log("use fountain fountain");
res = execCommand(game, "use", "fountain", "fountain");
console.log("> " + res.text); // this will be inline buttons in telegram chat

console.log("use inventory");
res = execCommand(game, "use", "inventory");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("use bottle");
res = execCommand(game, "use", "bottle");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("use bottle inventory");
res = execCommand(game, "use", "bottle", "inventory");
console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

console.log("use bottle bottle");
res = execCommand(game, "use", "bottle", "bottle");
console.log("> " + res.text ); // this will be inline buttons in telegram chat

console.log("use bottle fountain");
res = execCommand(game, "use", "bottle", "fountain");
console.log("> " + res.text ); // this will be inline buttons in telegram chat

console.log("use fountain bottle");
res = execCommand(game, "use", "fountain", "bottle");
console.log("> " + res.text); // this will be inline buttons in telegram chat

//console.log("use bottle");
//res = execCommand(game, "use", "bottle");
//console.log("> " + res.text + " " + res.selection.list.join(", ")); // this will be inline buttons in telegram chat

//console.log("use bottle fountain");
//console.log("> " + execCommand(game, "use", "bottle", "fountain").text);

//console.log("go south");
//console.log("> " + execCommand(game, "go", "south").text);

//console.log("use bottle bonfire");
//console.log("> " + execCommand(game, "use", "bottle", "bonfire").text);

//console.log("look at bonfire");
//console.log("> " + execCommand(game, "look at", "bonfire").text);

//console.log("pick up key");
//console.log("> " + execCommand(game, "pick up", "key").text);

//console.log("go north");
//console.log("> " + execCommand(game, "go", "north").text);
//console.log("pick up bottle");
//console.log("> " + game.execCommand("pick_up", "bottle").description);
//console.log("go south");
//console.log("> " + game.execCommand("go", "south").description);
//console.log("go north");
//console.log("> " + game.execCommand("go", "north").description);
//console.log(game.state.inventory);