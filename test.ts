// tests go here; this will not be compiled when this package is used as an extension.
ps2controller.initPS2Pin(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15, DigitalPin.P16)
serial.redirectToUSB()
basic.forever(function () {
    if (ps2controller.button_pressed(ps2controller.PS2Button.Cross) != 0) {
        basic.showIcon(IconNames.No)
    } else if (ps2controller.button_pressed(ps2controller.PS2Button.Up) != 0) {
        basic.showIcon(IconNames.Diamond)
    } else if (ps2controller.stick_value(ps2controller.PSS.RX) != 0) {
        serial.writeLine(convertToText(ps2controller.stick_value(ps2controller.PSS.RX)))
    } else {
        basic.clearScreen()
    }
})