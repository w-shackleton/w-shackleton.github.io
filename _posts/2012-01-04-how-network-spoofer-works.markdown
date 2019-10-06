---
layout: post
title:  How Network Spoofer v1 worked
date:   2012-01-04 11:00:00 +0000
categories: blog
---

NOTE: This article is very old and describes how Network Spoofer used to work.
Network Spoofer v1 was based off the
["Upside-Down-Ternet"](http://www.ex-parrot.com/pete/upside-down-ternet.html)
by Pete Stevens.
Check out [Network Spoofer v2 on Github](https://github.com/w-shackleton/android-netspoof).

A few people have been asking how Network Spoofer actually works; hopefully
this explanation will allow people to understand its working and try out their
own spoofs.

## The download file

Firstly, the extra download file is a minimal version of a debian system –
having the same system on each device makes it easier to ensure the same will
happen on the same device.

When Network Spoofer is run, the file is loaded (mounted) on the phone to allow
the files to be accessed. This is where almost all of the bugs with Network
Spoofer not loading occur; for some reason some devices just won’t load the
file. If you want to have a go at mounting the file on the phone, then
[this script](http://bazaar.launchpad.net/~w-shackleton/android-netspoof/trunk/view/head:/res/raw/config)
is used to actually load it, and the variables used are set by the application
itself before running the script.

One of the reasons this stage sometimes doesn’t work is that Android’s app2SD
(applications on the SD card) uses this same method to load SD card
applications, and this could be interfering on some phones.

## Running programs inside the debian system

For programs to function correctly on this new system, a few system folders
have to be mounted inside the new system – namely `/dev`, `/proc` and `/sys`.
This is also done in [the script](http://bazaar.launchpad.net/~w-shackleton/android-netspoof/trunk/view/head:/res/raw/config)
mentioned above.
The unix command `chroot` is used to actually run programs inside the new
debian system – it makes the program think it has a different ‘root’ (top)
folder.

## Setting the system up to run spoofs

Inside this new environment (where programs think they are actually running on
a debian computer), the script
[/usr/local/bin/spoof](http://bazaar.launchpad.net/~w-shackleton/android-netspoof/debimg-trunk/view/head:/debimg/usr/local/bin/spoof)
is run. This script uses the phone settings given by the Android app (as well
as some detected settings) to set up the phone, ready to start spoofing.
First, it starts arpspoof running in the background on the phone
([line 97](http://bazaar.launchpad.net/~w-shackleton/android-netspoof/debimg-trunk/view/head:/debimg/usr/local/bin/spoof#L97))
which basically gets all internet traffic going first through the phone. The
phone tells the victim computer that it is the router, and tells the router
that it is the victim – this is called a ‘man in the middle’ attack.

To change information on websites, data travelling on port 80 needs to be
redirected to something else (line 115) and then picked up by a proxy server
which is started on the phone (line 112). The proxy server can then change or
redirect whatever it wants to on the phone.

## Changing data on websites

There are a set of scripts in the /rewriters folder in the debian image. Each
one waits for URLs to be inputted (typed into it), then returns a new and
potentially modified URL. The easiest way to add a new spoof is to add a new
script (based off one of the others) along with a text file describing it (see
one of the others for an example).
 
A link is created to the script to be used (line 111), or if multiple spoofs
are used a script is created which chains the selected scripts together. There
is an option in the configuration for the proxy which tells it to use the
linked script to change URLs as they are asked for – this is the key feature of
the proxy.
If data on the webpage is changed, the script may download the HTML file,
change it and put it in the folder /var/www/images. This folder is visible on a
webserver which is run on the phone (see the
[image flip script](http://bazaar.launchpad.net/~w-shackleton/android-netspoof/debimg-trunk/view/head:/debimg/rewriters/flip.pl)
for an example)
The spoof is now running – the script then waits for an enter key press before
stopping. It then stops the arp spoof, shuts down the proxy and the webserver,
removes the port 80 redirect rule and finishes.
 
I hope this has explained the inner workings and will help people to expand the
project, fix issues on certain devices and create more spoofs. If you have a
feature that you’ve created / would like implementing, file a request /
question or add your own branch of the code on the launchpad code hosting page.
