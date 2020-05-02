---
layout: post
title:  Broken Hard Drive vs BIOS Battery
date:   2020-05-02 10:00:00 +0000
categories: blog
---

I have a home server, which runs on an old desktop computer from 2009 or so.
This office PC, despite being quite old, has very quiet fans, basic onboard
VGA, onboard SATA, gigabit Ethernet and 4GB of RAM making it a very
respectable home server.

After upgrading the Linux distro on it I noticed a few days later that I
couldn't upload files to it. I checked dmesg and noticed BTRFS errors spewing
past about disk writes timing out or something. I promptly shut down the server
and ordered two replacement hard drives so I had somewhere to attempt to dump
data whilst salvaging what I presumed to be a disk failure or a bad kernel or
something.

I ordered an SSD to replace the system HDD at the same time.

When everything arrived I used my PC to image the system HDD to the SSD and
booted the server up on its new SSD with the data partition removed from
`fstab`; the data disks were still plugged in. It got stuck on boot and started
spewing the same error messages. I tried each data disk on its own and *still*
I got the same errors.

Oh dear. Perhaps both my mirrored drives had given up the ghost simultaneously!

I plugged the data drives into my desktop and booted up: they worked just fine.
I booted the server up with *just* the SSD and it booted. When I tried it with
the two *new* data disks, it failed.  It was at this point I assumed that the
motherboard was fried and started looking at purchasing a new home server.

There was one final thing that didn't make sense: during boot the BIOS was
complaining how the case intrusion detection switch had fired: I was sure that
I had disabled this feature in the BIOS. I checked further and *all* the BIOS
configuration was reset. I noticed one final message in the BIOS logs:

```
Invalid BIOS configuration, system battery low
```

I've never had to replace a BIOS battery before, but I guess they do run out
after about 11 years or so. I swapped the battery with the battery in the
kitchen scales and lo and behold, the BIOS didn't complain and the kitchen
scales didn't work. I turned off the case intrusion setting, set the boot drive
order and booted up. The error was *still* occurring.

It was at this point that I looked at the stack trace a bit more:

```
INFO: task btrfs:312 blocked for more than 120 seconds.
...
__schedule
__switch_to_asm
__switch_to_asm
schedule
schedule_timeout
wait_for_completion
wake_up_q
__floppy_read_block_0
floppy_cmos_show
floppy_revalidate
check_disk_change
floppy_open
disk_block_events
__blkdev_get
blkdev_get
blkdev_get_by_dev
blkdev_open
do_dentry_open
vfs_open
...
```

The *floppy disk* driver? What?

Now yes, my home server used to have a floppy drive. I had removed it: you can
put hard drives in floppy drive bays in most desktop towers.  I (re)-disabled
the floppy drive in the BIOS and everything booted as per usual.

What I can only assume was happening was that the floppy controller on this
motherboard can't detect if there's no floppy drive connected. Presumably the
line in the floppy cable indicating if a disk is inserted was floating "on" and
the motherboard was trying to step the motor to read sector 0.

Why was this only found when I upgraded the server's OS? After I did that I
unplugged it to vacuum the case out. It had been plugged into mains for several
months before that.

Why did the server boot with only the SSD? No idea. Perhaps with only 1 working
disk and 1 I/O-blocking "floppy drive" the kernel had enough threads to not get
all of them stuck waiting.

The good news is I now have a bit more storage space on my server :)
