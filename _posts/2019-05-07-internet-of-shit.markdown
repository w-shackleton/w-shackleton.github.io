---
layout: post
title:  Managing your Internet Of Sh*t
date:   2019-05-07 15:00:00 +0000
categories: blog
---

Count the number of Smart devices you own. I had a serious problem, it was
greater than zero. In fact, the number of devices that I didn't really want on
my home network was about ten. This is a problem that plagues anyone with more
than a bunch of phones on their home network: if you have laptops or desktops
then you want to be careful what can throw packets at them.

I cared about this problem quite a lot, for two reasons: firstly I have a home
server containing all my personal files, and secondly I'm a computer nerd who
won't settle for "normal" solutions to problems.

## Enumeration

So what do I have on my network?

* Personal (non-work) devices (phones, laptops, tablets)
* Two desktops (wired)
* A home server
* Work devices
  * Phones
  * Laptops (wireless, or wired when work-from-home)
* Three Chromecasts (1 Chromecast, 2 Chromecast Audio)
* A Philips Hue lighting system
* A Hive smart thermostat
* A Dyson smart-fan-air-filter-thing

...too much. This is split across two floors so for the networking hardware I
have:

* DSL modem
* Netgear R6400 running DD-WRT (custom router firmware)
* (newly acquired) Cisco managed switch
* Powerline ethernet adapters

## Trusted network

My primary network contains the devices I trust to talk to each other. I'm
using the default network in DD-WRT for: personal phones, laptops and desktops,
and the home server. With one desktop straight into the router, and the server
and another desktop behind the managed switch upstairs, this works well.

I had one issue with my personal phone: it didn't quite like my 5GHz network.
To solve this I created a separate SSID only on 2.4GHz.

<figure>
    <div class="two-img">
        <img src="/img/2019/internet-of-shit/wifi-2.png" />
        <img src="/img/2019/internet-of-shit/wifi-5.png" />
    </div>
    <figcaption>2.4GHz and 5GHz networks</figcaption>
</figure>

<figure>
    <img src="/img/2019/internet-of-shit/wifi-bc.png" />
    <figcaption>2.4GHz only network for my phone</figcaption>
</figure>

## Untrusted (guest) network

Next, I needed a guest network. This is for guests, the iPad (Netflix) and work
devices. This has two separate IPv4 blocks, one for 2.4GHz and another for 5GHz
(not pictured).

<figure class="col-md-6">
    <img src="/img/2019/internet-of-shit/guesty.png" />
    <img src="/img/2019/internet-of-shit/multi-dhcp.png" />
    <figcaption>My guest network</figcaption>
</figure>

There are two crucial options enabled here: firstly, "Net Isolation". This
configures DD-WRT to only allow this network to talk to the internet (not the
other networks). Secondly, "AP Isolation": this configures the wireless card to
not allow devices to talk to each other (so guest devices can't talk to each
other).

## Untrusted (work) wired internet

When working from home it's useful to plug the work laptop into ethernet. This
can be useful upstairs and downstairs. This can be accomplished in DD-WRT using
VLANs:

<figure>
    <img src="/img/2019/internet-of-shit/vlans.png" />
    <figcaption>VLAN configuration</figcaption>
</figure>

Port 1 on my router is assigned to VLAN 3, for the work laptop. I set up this
VLAN similarly to the guest network, but under the "Networking" tab:

<figure>
    <img src="/img/2019/internet-of-shit/work-net.png" />
    <figcaption>Work network settings</figcaption>
</figure>

Again, "Net Isolation" is turned on. DHCP is also configured as before.

What about upstairs? For this I enabled tagged VLANs on the ethernet to my
managed switch. This means that VLANs 1, 3 and 4 (used later) can traverse this
link but remain isolated.

In the switch settings, that looks like this:

<figure class="col-md-6">
    <img src="/img/2019/internet-of-shit/switch-1.png" />
    <figcaption>Switch VLAN configuration</figcaption>
</figure>

<figure>
    <div class="three-img">
        <img src="/img/2019/internet-of-shit/switch-2.png" />
        <img src="/img/2019/internet-of-shit/switch-3.png" />
        <img src="/img/2019/internet-of-shit/switch-4.png" />
    </div>
    <figcaption>Switch VLAN configuration</figcaption>
</figure>

## Internet of Shit part 1 - required local net access

It turns out that Chromecasts really have to be on the same subnet as the phone
controlling them :/

I haven't worked out a solution for the Chromecasts yet. For now they are on
another wifi network that is bridged in the same fashion as the network for my
phone.

<figure>
    <img src="/img/2019/internet-of-shit/wifi-ios-v.png" />
    <figcaption>Chromecast network</figcaption>
</figure>

## Internet of Shit part 2 - isolation is OK

The Dyson fan is the best (or worst?) kind of IoS device: it is controlled
entirely by a third-party server! This means it needs no local access and can
go on yet another wifi network:

<figure>
    <img src="/img/2019/internet-of-shit/wifi-ios-v.png" />
    <figcaption>Dyson fan network</figcaption>
</figure>

## Internet of Shit part 3 - I talk to you, you don't talk to me

The Philips Hue is controlled by regular HTTP RPC requests to a local
webserver. This means it can go on its own isolated network and I can poke a
hole in the firewall. The Hue is plugged into the switch via VLAN 4:

<figure>
    <img src="/img/2019/internet-of-shit/hue.png" />
    <figcaption>Dyson fan network</figcaption>
</figure>

I can then poke a hole in the firewall:

<figure>
    <pre>
        <code>
iptables -I FORWARD -i br0 -d 10.5.11.0/24 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
        </code>
    </pre>
    <figcaption>iptables to allow the Hue app through to the Hue network</figcaption>
</figure>

Wait - how does the Hue app find the device on this custom subnet? The Hue app
finds the device using mDNS, a multicast device discovery protocol. These
requests can be forwarded across networks using a repeater. For this I
installed the DD-WRT optware package system and used it to install
`avahi-daemon`.

<figure>
    <pre>
        <code>
mount -o bind /jffs/opt /opt
echo "nogroup:x:114:nobody" >> /etc/group
/opt/etc/init.d/rc.unslung start
        </code>
    </pre>
    <figcaption>DD-WRT startup script</figcaption>
</figure>

<figure>
    <pre>
        <code>
[server]
use-ipv4=yes
use-ipv6=no
check-response-ttl=no
use-iff-running=no
allow-interfaces=br0,wl0.3,wl0.1,wl1.1,vlan4
allow-point-to-point=yes

[publish]
publish-addresses=yes
publish-hinfo=yes
publish-workstation=no
publish-domain=yes

[reflector]
enable-reflector=yes
reflect-ipv=no

[wide-area]
enable-wide-area=no
        </code>
    </pre>
    <figcaption>/opt/etc/avahi/avahi-daemon.conf</figcaption>
</figure>

Finally we can allow these packets through, too:

<figure>
    <pre>
        <code>
iptables -I INPUT -p udp --dport 1900 -i br0 -j ACCEPT
iptables -I INPUT -p udp --dport 1900 -i vlan4 -j ACCEPT
iptables -I FORWARD -p udp --dport 5353 -i br0 -j ACCEPT
iptables -I FORWARD -p udp --dport 5353 -i vlan4 -j ACCEPT
iptables -I INPUT -p udp --dport 5353 -i vlan4 -j ACCEPT
iptables -I INPUT -p udp --dport 5353 -i br0 -j ACCEPT
# Increase IP TTL so it can go an extra hop
iptables -t mangle -A PREROUTING -d 239.255.255.250 -j TTL --ttl-inc 1
iptables -t mangle -A PREROUTING -d 224.0.0.251 -j TTL --ttl-inc 1
        </code>
    </pre>
    <figcaption>Moar firewall</figcaption>
</figure>

Now the Hue app magically finds the device!

## Final miscellany

<figure>
    <pre>
        <code>
# Turn all the LEDs off ;)
for i in 1 2 6 7 8 9 12 13; do gpio enable $i; done
for i in 10 11; do gpio disable $i; done
        </code>
    </pre>
    <figcaption>Extra startup script</figcaption>
</figure>

<figure>
    <pre>
        <code>
# Allow access to DSL modem status page
ifconfig `nvram get wan_ifname`:0 192.168.2.2 netmask 255.255.255.0
iptables -t nat -I POSTROUTING -o `nvram get wan_ifname` -j MASQUERADE

# Allow ipv6 route out via ppp0 - AAISP seem to not push default route
ip -6 route add default dev ppp0 metric 1
        </code>
    </pre>
    <figcaption>Extra startup script</figcaption>
</figure>
