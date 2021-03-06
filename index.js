"use strict";

const DocumentServer = require('./lib/document_server');

const PORT = 8081;
const DOCUMENTS = [
	"Something was shining on the wall ahead. They approached slowly, squinting through the darkness. Foot-high words had been daubed on the wall between two windows, shimmering and shining in the light cast by the flaming torches. the chamber of secrets has been opened. enemies of the heir, beware",
	"The voice was growing fainter. Harry was sure it was moving away - moving away and further. A mixture of fear and excitement gripped him as he stared at the dark ceiling; how could it be moving away and upward? Was it a phantom, to whom stone ceilings didn't matter? This way, he shouted, and he began to run, up the stairs, into the entrance hall. It was no good hoping to hear anything here, the babble of talk from the Halloween feast was echoing out of the Great Hall. Harry sprinted up the marble staircase to the first floor, Ron and Hermione clattering behind him",
	"Fascinated, Harry thumbed through the rest of the envelope's contents. Why on earth did Filch want a Kwikspell course? Did this mean he wasn't a proper wizard? Harry was just reading Lesson One: Holding Your Wand (Some Useful Tips) when shuffling footsteps outside told him Filch was coming back. Stuffing the parchment back into the envelope, Harry threw it back onto the desk just as the door opened.",
	"Harry was staring at him, alarmed; Filch had never looked madder. His eyes were popping, a tic was going in one of his pouchy cheeks, and the tartan scarf didn't help. Amazed at his luck, Harry sped out of the office, up the corridor, and back upstairs. To escape from Filch's office without punishment was probably some kind of school record. Nearly Headless Nick came gliding out of a classroom. Behind him, Harry could see the wreckage of a large black-and-gold cabinet that appeared to have been dropped from a great height. Nearly Headless Nick stopped in his tracks and Harry walked right through him. He wished he hadn't; it was like stepping through an icy shower",
];

const server = new DocumentServer(DOCUMENTS, PORT, __dirname);
server.listen();