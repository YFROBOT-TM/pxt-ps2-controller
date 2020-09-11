let error = false
ps2controller.initPS2Pin(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15, DigitalPin.P16)
basic.forever(function () {
    error = ps2controller.readGamepad()
    if (ps2controller.button_pressed(ps2controller.PS2Button.Up) != 0) {
    	
    }
})
