---
layout: post
title:  Smart radiator valves and limescale
date:   2020-11-28 10:00:00 +0000
categories: blog
---

I bought some Netatmo smart radiator valves recently. Our building has communal
heating so the hot water is always on. When I installed them to replace the
three Drayton TRV4 in our flat, things got a bit toasty: all the radiators were
pumping out heat and the temperature rose wildly above the setpoint (16C to
24C).

Thermostatic radiator valves have a little pin that gets pushed in and out by
the thermostat: out is "on", in is "off". This meant that the smart valve
wasn't pushing the pin all the way in.

The Netatmo app has a Calibrate button which moves the motor inside the valve
to detect the minimum and maximum position of the pin. When run whilst not
attached to a radiator you can see the plunger move all the way out and all the
way in. Presumably when attached to a radiator it moves the plunger until it
feels some resistance, then moves it until it feels a lot. I guessed that this
detection was not finding the true end of the pin's movement since the
calibration process finished rather quickly: the motor could be heard moving
out and then in shortly afterwards.

The solution: oil the pin! I used WD40 on the pin and quickly pushed it in/out
for a minute, after which it moved a lot more easily.

After reattaching the valve the calibration process took a lot longer and
consisted of five discernable motions: out, in, out again, in again, then
finally set the position to "off".

Perhaps this seems obvious in retrospect but I couldn't find much info on the
internet!
