import { Bubble } from "../cursors/bubble.js";
import { Lightning } from "../cursors/lightning.js";
import { Character } from "../cursors/character.js";
import { Clock } from "../cursors/clock.js";
import { Emoji } from "../cursors/emoji.js";
import { FairyDust } from "../cursors/fairy-dust.js";
import { Fire } from "../cursors/fire.js";
import { FollowingDot } from "../cursors/following-dot.js";
import { Rainbow } from "../cursors/rainbow.js";
import { Snowflake } from "../cursors/snowflake.js";
import { SpringyEmoji } from "../cursors/springy-emoji.js";
import { TextFlag } from "../cursors/text-flag.js";
import { Trailing } from "../cursors/trailing.js";

import { options as defaultOptions } from './default-options.js';

export class TceFactory {
	constructor() {
		this.classMap = {
			lightning: Lightning,
			bubble: Bubble,
			character: Character,
			clock: Clock,
			emoji: Emoji,
			fairyDust: FairyDust,
			fire: Fire,
			followingDot: FollowingDot,
			rainbow: Rainbow,
			snowflake: Snowflake,
			springyEmoji: SpringyEmoji,
			textFlag: TextFlag,
			trailing: Trailing
		};
	}

	listAll() {
		return Object.keys(this.classMap).map(name => ({
			name: name,
			options: this.classMap[name].getOptions()
		}));
	}

	getCursor(name) {
		return this.classMap[name.toLowerCase()];
	}

	getDefaultOptions() {return defaultOptions;}
}