---
layout: post
title:  Hiding a website from low-level attackers
date:   2019-10-06 11:00:00 +0000
categories: blog
---

I run a home server for a few different things and as many do, I expose this
server to the internet.

This has always had me worried: I'm running an HTTP server on port 80 and 443,
and there are lots of people out there on the internet hell-bent on running
every automated exploit known to humans across said internet on a frighteningly
regular basis.

I took some steps to allow me to continue to access my home server whilst
hopefully diverting the deluge of garbage to `/dev/null`.

## Step 1: path

The first step I took is fairly simple: **don't host services on default
paths!** If you're running Wordpress, move your `/wp-admin` folder somewhere
else. You'll immediately take away 99% of your fake logins; this is akin to
moving SSH off port 22.

If you want to mess with the evil spirits, set up fake endpoints at eg.
`/wp-admin` that wait 30 seconds before responding.

## Step 2: exposing the server to the internet

IPv6 is your friend. IPv6 is great because your home network should have
multiple IPv6 addresses: browsing the internet on your phone doesn't leave your
server's IP in people's logs. If you have IPv6 then you'll find that most of
your traffic exits to the internet via IPv6 from your phone, hiding the IPv6
address of your server.

*Side note: My DD-WRT router doesn't have great IPv6 port-opening support so I configure it using a cronjob on my server:*

<figure>
<pre>
<code>
ipv6=$(ip -6 addr | grep 'scope global' | awk '{print $2}' | sed 's&#x2F;&bsol;&#x2F;.&ast;&#x2F;&#x2F;')
sshpass -p &lt;router password&gt; ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@10.0.0.1 ip6tables -I FORWARD -p tcp -d "$ipv6" --dport 443 -j ACCEPT
</code>
</pre>
</figure>

So let's assume that no low-level attacker is going to find your IPv6 address.
Unfortunately, parts of the world are still stuck on IPv4 so we have to expose
the server there too.

This is scary: IPv4 address can be (and are) easily enumerated and scanned by
attackers.

## Step 3: limiting Apache virtual hosts to only allow the expected hostname

My experience and log files say that these web scrapers find your site by
enumerating your IP address, not by finding your DNS. Provided that your DNS is
reasonably obscure (ie. not `www.`) and you don't have reverse DNS set up, they
are going to hit your site directly by IP address.

This is good for us! We can configure Apache to ignore all such requests:

<figure>
<pre>
<code>
# /etc/apache2/sites-enabled/real-website.conf
&lt;IfModule mod_ssl.c>
&lt;VirtualHost _default_:443>
    ServerAdmin webmaster@localhost
    ServerName myserver.mywebsite.com
    DocumentRoot /var/www/html
    ...

# /etc/apache2/sites-enabled/zzz-default-ssl.conf
&lt;IfModule mod_ssl.c>
&lt;VirtualHost _default_:443>
    ServerAdmin webmaster@localhost
    ServerName www.example.com
    ServerAlias *
    DocumentRoot /var/www/go-away
    ...
</code>
</pre>
<figcaption>Apache config to route all requests with wrong Host somewhere
else</figcaption>
</figure>

## Step 4: stopping hostname leaks via TLS

There's one final leak that I haven't yet worked out how to plug: TLS
certificates. Currently if you connect to my server over TLS you'll get my real
TLS certificate back: this contains the DNS name that points to it. It would be
nice to fix this one too.
