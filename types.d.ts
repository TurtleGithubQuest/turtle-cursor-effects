export type CursorEffectResult = {
    destroy(): void;
}

export type DefaultOptions = {
    readonly element?: HTMLElement;
}

export type BubbleCursorOptions = {
} & DefaultOptions;

export type CharacterCursorOptions = {
    readonly characters?: readonly string[];
    readonly colors?: readonly string[];
    readonly cursorOffset?: { readonly x: number; readonly y: number };
    readonly font?: string;
    readonly characterLifeSpanFunction?: () => number;
    readonly initialCharacterVelocityFunction?: () => { readonly x: number; readonly y: number };
    readonly characterScalingFunction?: () => number;
    readonly characterNewRotationDegreesFunction?: (age: number, lifeSpan: number) => number;
} & DefaultOptions;

export type ClockCursorOptions = {
    readonly dateColor?: string;
    readonly faceColor?: string;
    readonly secondsColor?: string;
    readonly minutesColor?: string;
    readonly hoursColor?: string;
    readonly theDays?: string[];
    readonly theMonths?: string[];
} & DefaultOptions;

export type EmojiCursorOptions = {
    readonly emoji?: readonly string[];
} & DefaultOptions;

export type FairyDustCursorOptions = {
    colors?: readonly string[];
} & DefaultOptions;

export type FollowingDotCursorOptions = {
    readonly color?: string;
} & DefaultOptions;

export type GhostCursorOptions = {
    readonly randomDelay?: boolean;
    readonly minDelay?: number;
    readonly maxDelay?: number;
    readonly image?: string;
} & DefaultOptions;

export type RainbowCursorOptions = {
    length?: number;
    colors?: readonly string[];
    size?: number;
} & DefaultOptions;

export type SnowflakeCursorOptions = {
} & DefaultOptions;

export type SpringyEmojiCursorOptions = {
    readonly emoji?: string;
} & DefaultOptions;

export type TextFlagOptions = {
    readonly text?: string;
    readonly color?: string;
    readonly size?: number;
    readonly font?: string;
    readonly textSize?: number;
    readonly gap?: number;
} & DefaultOptions;

export type TrailingCursorOptions = {
    readonly particles?: number;
    readonly rate?: number;
    readonly baseImageSrc?: number;
} & DefaultOptions;

export function bubble(options?: BubbleCursorOptions): CursorEffectResult;
export function character(options?: CharacterCursorOptions): CursorEffectResult;
export function clock(options?: ClockCursorOptions): CursorEffectResult;
export function emoji(options?: EmojiCursorOptions): CursorEffectResult;
export function fairyDust(options?: FairyDustCursorOptions): CursorEffectResult;
export function followingDot(options?: FollowingDotCursorOptions): CursorEffectResult;
export function rainbow(options?: RainbowCursorOptions): CursorEffectResult;
export function snowflake(options?: SnowflakeCursorOptions): CursorEffectResult;
export function springyEmoji(options?: SpringyEmojiCursorOptions): CursorEffectResult;
export function textFlag(options?: TextFlagOptions): CursorEffectResult;
export function trailing(options?: TrailingCursorOptions): CursorEffectResult;
export function lightning(options?: DefaultOptions): CursorEffectResult;
export function fire(options?: DefaultOptions): CursorEffectResult;