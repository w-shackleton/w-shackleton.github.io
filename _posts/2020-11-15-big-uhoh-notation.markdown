---
layout: post
title:  BIG-UhOh() NOTATION
date:   2020-11-15 10:00:00 +0000
categories: blog
smallcaps: true
---

I suggest a new system complexity notation: Big-UhOh() notation.

A system that is UhOh(*n*) means that *n* failures cause *n* propagated
problems in other systems. For example, *n* errors in your service = *n*
crashes in the client.

A system that is UhOh(*n*²) means that each error causes *n* downstream issues.
For example, if one shard goes down for a short time period that can cause
errors across all clients.

A system that is UhOh(*n*³) means that each error causes *n*² downstream
issues.  For example, pushing a single bad configuration can break every client
for an arbitrary amount of time: *n* * *n*.

A system that is UhOh(1) can absorb the errors.
