---
layout: post
title:  Snake in my Boot
date:   2020-02-04 19:00:00 +0000
categories: blog
---

I've always been fascinated by the computer boot process: concentric layers of
software that each exists to make the next one run. Reading the source code to
various kernels always results in thousands of lines of assembly before any C
code is executed. Reading assembly is really difficult and it always made me
wonder, "what do you *really need* to be able to actually run C on x86?"

To try and answer that I decided to write a bootloader. This bootloader lets
you play Snake, and fits in an MBR boot sector. This is important because it
means you can say "there's a snake in my boot!".

**Here it is:** [github.com/w-shackleton/snake-in-my-boot](https://github.com/w-shackleton/snake-in-my-boot)

<figure>
  <img src="https://raw.githubusercontent.com/w-shackleton/snake-in-my-boot/master/demo.png" />
</figure>

## What had to remain in assembly?

I was unable to write the following code in C:

* Entry-point: this has to zero-out all the registers and so must be done in
  assembly.
* Screen mode, keyboard poll, sleep, shut-down: these required calling BIOS
  interrupts which must be done from assembly.
* Drawing the screen: GCC can not compile C that makes use of "far pointers"
  which are required to access the video memory in 16-bit addressing.

## Space-efficient code

I had to make my compiled code consume as few bytes as possible.

I'm relatively new to writing assembly but I was able to find a few tricks to
save some bytes. For example, the instruction `pushad` is a single byte but
pushes all general-purpose registers to the stack.

In C, I avoided branches as much as possible. I noticed that switch statements
especially result in very heavy assembly. I performed bounds-checking the game
area using bitmasks and I used a lookup table to work out which direction the
snake should travel in based on the keystroke. I also stored the snake's x,y
coordinate in a single value which made its position a single array rather than
two.
