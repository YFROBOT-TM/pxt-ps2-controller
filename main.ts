basic.forever(function () {
    if (ps2controller.button_pressed(ps2controller.PS2Button.Cross) > 0) {
        basic.showIcon(IconNames.Heart)
        basic.pause(500)
    } else {
        basic.clearScreen()
    }
})
