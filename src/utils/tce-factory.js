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
export class TceFactory {
	listAll() {
		return [
			{
				name: 'lightning',
				options: Lightning.getOptions()
			},
			{
				name: 'bubble',
				options: Bubble.getOptions()
			},
			{
				name: 'character',
				options: Character.getOptions()
			},
			{
				name: 'clock',
				options: Clock.getOptions()
			},
			{
				name: 'emoji',
				options: Emoji.getOptions()
			},
			{
				name: 'fairy-dust',
				options: FairyDust.getOptions()
			},
			{
				name: 'fire',
				options: Fire.getOptions()
			},
			{
				name: 'following-dot',
				options: FollowingDot.getOptions()
			},
			{
				name: 'rainbow',
				options: Rainbow.getOptions()
			},
			{
				name: 'snowflake',
				options: Snowflake.getOptions()
			},
			{
				name: 'springy-emoji',
				options: SpringyEmoji.getOptions()
			},
			{
				name: 'text-flag',
				options: TextFlag.getOptions()
			},
			{
				name: 'trailing',
				options: Trailing.getOptions()
			}
		];
	}
}