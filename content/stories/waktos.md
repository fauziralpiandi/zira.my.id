---
title: Engineering of a Date Library
summary: How a simple helper function evolved into a 5kB library that solves JavaScript date manipulation problems.
date: 2025-09-24
---

## It Started as a Helper Func.

The JavaScript Date API? Clunky, confusing, and lowkey cursed. Like, who thought returning `0-11` for `getMonth()` was a vibe? Or `getYear()` spitting out `123` for 2023? Absolute chaos. Out of that pain came a tiny helper function for formatting dates, adding/subtracting days, and handling basic timezones. After copy-pasting it into way too many side projects, I realized: **dates are just math with extra drama**. That’s when **waktos** was born — a 5kB library designed to end developer suffering in JavaScript date-land.

## Everything is Timestamp

At the core, dates boil down to numbers. Unix timestamp = seconds since January 1, 1970. If you’re in UTC, it’s just adding and subtracting integers. Pure math, no nonsense.

```ts /timestamp/
// Short version
return createInstance(
  this._timestamp + value * multiplier,
  this._locale,
  this._timezone,
);
```

**Why timestamp-first?**

- Lean memory usage (~32 bytes per instance)
- One single source of truth (no sync headaches)
- UTC ops = fast math mode

Quick benchmarks show: **~42% faster instance creation, ~67% less memory footprint**.

## Map Cache Hack

`Intl.DateTimeFormat` is heavy (seriously) — like 10–50ms per call heavy. Solution? cache! At first I tried objects, but implementing LRU (Least Recently Used) got messy. Then I found out `Map` in JS has a secret move: `delete` + `set` pushes items to the back, making a dead-simple LRU.

```ts {2-3}
#bump(key, value) {
  this.#cache.delete(key);
  this.#cache.set(key, value);
}
```

Result? **~90% cache hit rate** after warmup. Cold start penalty exists, but subsequent operations are lightning fast. Smooth, fr.

## Timezone Hell

DST (Daylight Saving Time) is the global prank humanity decided to play on programmers. Offsets jump an hour out of nowhere. **Waktos** tackles this with an **iterative refinement** algorithm:

1. Calculate initial UTC based on estimated offset:

   ```ts caption="Estimate"
   let estimatedUtc = local - offsetEstimate * MINUTE;
   ```

2. Get actual offset for estimated UTC:

   ```ts caption="Test"
   const initialOffset = calcTimezoneOffset(estimatedUtc, tz);
   ```

3. Adjust calculation based on difference:

   ```ts caption="Refine"
   estimatedUtc -= (initialOffset - offsetEstimate) * MINUTE;
   ```

4. Test refined calculation:

   ```ts caption="Validate"
   const refinedOffset = calcTimezoneOffset(estimatedUtc, tz);
   ```

5. Choose smaller offset to avoid double-counting:

   ```ts caption="Decide"
   const finalOffset = Math.min(initialOffset, refinedOffset);
   ```

> Better to be roughly right than precisely wrong. Pragmatic approximation is more valuable than perfect accuracy that's fragile.

## Two-Pass Formatting

Date formatting has two jobs: keep literal text safe, swap tokens with values. Example: `[Born on] YYYY-MM-DD`. Solution? Two passes. First capture literals, then replace tokens.

```ts
const parsePattern = (pattern, locale) => {
  // Pass 1: literals
  // Pass 2: tokens
};
```

And lazy evaluation with function closures. Token values are computed only when needed, with locale-aware number formatting.

## Human Psychology in Code

Tiny tweaks, big vibes:

- Nobody says "1 week ago" — it’s always "last week".
- Anything under 5 seconds feels like "now".
- RTL languages (e.g. Arabic) get proper Unicode bidi love.

These details make the library feel natural to humans, not just machines.

## Extensibility

Still tiny, but pluggable:

```ts
waktos.plugin = (...plugins) => {
  /* ... */
};
```

With TypeScript module augmentation, extensions stay type-safe and clean.

## Lessons

- **Trade-off:** Timestamps make component access a bit verbose, but the perf wins are worth it.
- **Error handling:** Better roughly right than precisely wrong.
- **Bundle discipline:** Every feature got weighed against the 5kB cap.
- **DX first:** Months are 1-based, because dev brains > raw efficiency.

## Reflections

The invisible stuff — makes or breaks the experience. When it works, no one notices. When it doesn’t, everyone does. **Waktos** taught me that performance is about trade-offs, defensive programming is insurance, and small details punch way above their weight.

**End Result?**

A lightweight, fast, and delightfully human JavaScript date library:

- [Get started?](https://www.npmjs.com/package/waktos)
- [Visit the project?](https://github.com/fauziralpiandi/waktos)
