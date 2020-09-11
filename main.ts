let e = false
ps2controller.initPS2Pin(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15, DigitalPin.P16)
basic.forever(function () {
    e = ps2controller.readGamepad()
    if (ps2controller.button_pressed(ps2controller.PS2Button.Up) != 0) {
        music.playTone(262, music.beat(BeatFraction.Whole))
    }
})
