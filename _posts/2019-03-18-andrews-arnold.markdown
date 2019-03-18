---
layout: post
title:  Andrews & Arnold ISP
date:   2019-03-18 19:00:00 +0000
categories: blog
---

I recently moved flat in London, and I was quite reluctant to give up
Hyperoptic as my ISP. My new flat only has a VDSL line and so I went with
Andrews & Arnold, the UK ISP renowned for calling IPv4 the "legacy Internet"
and refusing to implement censorship technology.

This was a good move.

## Internet service

I've got a public IPv4 address and a /64 on IPv6; their account gives me a /48
should I so need it. I also get unfiltered, un-censored Internet access, and
2TB per month of traffic. This costs me £60 per month which is a fair bit more
than other "competitive" ISPs.

The service was installed by a BT OpenReach engineer which is standard across
most UK ISPs.

## Online accounts

AAISP really start to shine in their online accounts. Firstly, every account
has 2fac via Google Authenticator. Secondly, they have separate accounts for
billing and line configuration.

## Data insights

There's some nice graphs: certainly more detailed than my DD-WRT router gives
me:

<figure>
    <img src="/img/2019/aaisp/bw.png" />
    <figcaption>Detailed bandwith graphs</figcaption>
</figure>

I get emailed whenever the line goes down:

<figure>
    <img src="/img/2019/aaisp/notif.png" />
    <figcaption>Notification upon connection drop</figcaption>
</figure>

I can see the logs from the server(s) hosting their end of the connection:

<figure>
    <pre>
        <code>
2019-03-15... clueless bgpfeed: aa00@a Route 42.42.42.42/32 now 44.44.44.44
2019-03-16... clueless bgpfeed: aa00@a Route 42.42.42.42/32 now down
2019-03-16... clueless radius-acct: FTTC0000000 Stopped aa00@a.1 UserRequest
2019-03-16... clueless radius-auth: NMANPG eth 0/4/15:101@FTTC0000000 Platform 44.44.44.44 43.43.43.43#4095 aa00@a.1
2019-03-16... clueless radius-auth: FTTC0000000 TT Accept [unknown-lns] 43.43.43.43#48490 aa00@a.1 d.gormless Via=TT TCP-MRU-fix linerate=68497000/19999000 adjust=67241449(98.167%) MTU=1492
2019-03-16... clueless bgpfeed: aa00@a Route 42.42.42.42/32 now 46.46.46.46
2019-03-16... clueless radius-acct: FTTC0000000 Start aa00@a.1 43.43.43.43 d.gormless 21-E TT linerate=67241449/19999000 tcp-fix MRU=1492 I/F=00:00:00:00:00:00:00:00
        </code>
    </pre>
    <figcaption>Detailed (redacted) server logs about my connection</figcaption>
</figure>

The most fascinating piece of the line admin page for me is the log of the
line's transfer from the previous tenant's provider. Every message between A&A,
BT, TalkTalk and me is logged and is available:

<figure>
    <pre>
        <code>
Print/send information pack
Check address - may need creating Correct address needs entering
...
Track PSTN order 0-0-000000000000 Message: Informational 510 Order Acknowledged
Track PSTN order 0-0-000000000000 Message: Status: Matched
Track PSTN order 0-0-000000000000 Message: Status: Committed
Note TalkTalk order ref: 000000000 has entered PlanningDelayed state
Sent KCI email &lt;email&gt; Your broadband internet service order at &lt;postcode&gt; is expected to complete by end of 27th Feb 2019
Test line called (N)
...
Tx rate (adjusted) 67925673 to 67702834 (rx 19999000)
Sent KCI email &lt;email&gt; 2019-03-13 02:43:29 Line down (LostCarrier)
Sent KCI email &lt;email&gt; 2019-03-13 02:44:55 DSL line up (down 86 seconds)
        </code>
    </pre>
    <figcaption>A few sample logs</figcaption>
</figure>

## Other features

<figure>
    <img src="/img/2019/aaisp/dns-scan.png" />
    <figcaption>Regular scans to ensure I'm not running reflectable DNS servers</figcaption>
</figure>

<figure>
    <img src="/img/2019/aaisp/pppoe-dump.png" />
    <figcaption>I can create a network traffic dump to debug issues</figcaption>
</figure>

<figure>
    <img src="/img/2019/aaisp/ripe.png" />
    <figcaption>I can edit the RIPE entries for my IP ranges</figcaption>
</figure>

<figure>
    <img src="/img/2019/aaisp/buttons.png" />
    <figcaption>Buttons!</figcaption>
</figure>

## Summary

All in all I'm very impressed with A&A: as well as all the fancy buttons and
graphs and logs that make software people feel happy, the internet pipe is
absolutely stable: there's no 8pm bottleneck to be seen.
