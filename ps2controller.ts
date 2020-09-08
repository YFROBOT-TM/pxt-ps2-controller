//% weight=10 color="#7BD239" icon="\uf11b"
namespace ps2controller {

    // let chipSelect = DigitalPin.P16
    let chipSelect = DigitalPin.P15
    pins.digitalWritePin(chipSelect, 1)

    // pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
    pins.spiPins(DigitalPin.P14, DigitalPin.P13, DigitalPin.P16)
    pins.spiFormat(8, 3)
    pins.spiFrequency(250000)

    let pad = pins.createBuffer(6)
    let connected = false

    /*
    // Unused at the moment
    const config_cmd_enter = hex
        `014300010000000000`
    const config_cmd_exit = hex
        `014300005a5a5a5a5a`
    const config_enable_analog = hex
        `014400010300000000`
    const config_enable_vibration = hex
        `014d000001ffffffff`
    */0
    const poll_cmd = hex
        `014200000000000000`

    function send_command(transmit: Buffer): Buffer {
        // deal with bit-order
        transmit = rbuffer(transmit)

        let receive = pins.createBuffer(transmit.length);

        pins.digitalWritePin(chipSelect, 0);
        // send actual command
        for (let i = 0; i < transmit.length; i++) {
            receive[i] = pins.spiWrite(transmit[i]);
        }
        pins.digitalWritePin(chipSelect, 1)

        // deal with bit-order
        receive = rbuffer(receive)

        return receive
    }

    export enum PS2Button {
        Left,
        Down,
        Right,
        Up,
        Start,
        Analog_Left,
        Analog_Right,
        Select,
        Square,
        Cross,
        Circle,
        Triangle,
        R1,
        L1,
        R2,
        L2,
        Buttons,
        RX,
        RY,
        LX,
        LY,
    };

    /**
     * PS2 button pressed
     * @param b ps2 button;
     */
    //% weight=26
    //% block="button pressed %b"
    export function button_pressed(b: PS2Button): number {
        if (!connected) return 0x00

        switch (b) {
            case PS2Button.Left:
                return pad[0] & 0x80 ? 0 : 1;
            case PS2Button.Down:
                return pad[0] & 0x40 ? 0 : 1;
            case PS2Button.Right:
                return pad[0] & 0x20 ? 0 : 1;
            case PS2Button.Up:
                return pad[0] & 0x10 ? 0 : 1;
            case PS2Button.Start:
                return pad[0] & 0x08 ? 0 : 1;
            case PS2Button.Analog_Left:
                return pad[0] & 0x04 ? 0 : 1;
            case PS2Button.Analog_Right:
                return pad[0] & 0x02 ? 0 : 1;
            case PS2Button.Select:
                return pad[0] & 0x01 ? 0 : 1;
            case PS2Button.Square:
                return pad[1] & 0x80 ? 0 : 1;
            case PS2Button.Cross:
                return pad[1] & 0x40 ? 0 : 1;
            case PS2Button.Circle:
                return pad[1] & 0x20 ? 0 : 1;
            case PS2Button.Triangle:
                return pad[1] & 0x10 ? 0 : 1;
            case PS2Button.R1:
                return pad[1] & 0x08 ? 0 : 1;
            case PS2Button.L1:
                return pad[1] & 0x04 ? 0 : 1;
            case PS2Button.R2:
                return pad[1] & 0x02 ? 0 : 1;
            case PS2Button.L2:
                return pad[1] & 0x01 ? 0 : 1;
            case PS2Button.Buttons:
                return ~((pad[1] << 8) | pad[0]) & 0xffff;
            case PS2Button.RX:
                return pad[2] - 0x80;
            case PS2Button.RY:
                return pad[3] - 0x80;
            case PS2Button.LX:
                return pad[4] - 0x80;
            case PS2Button.LY:
                return pad[5] - 0x80;
        }
        return 0;
    }

    function poll(): boolean {
        let buf = send_command(poll_cmd)
        if (buf[2] != 0x5a) {
            return false;
        }

        for (let i = 0; i < 6; i++) {
            pad[i] = buf[3 + i];
        }

        connected = true

        return true
    }

    basic.forever(function () {
        poll();
    })


    // reverse 
    //"reverse": "github:gbraad/pxt-reversebit#v0.1.0"
    const rbits = hex`
    008040C020A060E0109050D030B070F0088848C828A868E8189858D838B878F8
    048444C424A464E4149454D434B474F40C8C4CCC2CAC6CEC1C9C5CDC3CBC7CFC
    028242C222A262E2129252D232B272F20A8A4ACA2AAA6AEA1A9A5ADA3ABA7AFA
    068646C626A666E6169656D636B676F60E8E4ECE2EAE6EEE1E9E5EDE3EBE7EFE
    018141C121A161E1119151D131B171F1098949C929A969E9199959D939B979F9
    058545C525A565E5159555D535B575F50D8D4DCD2DAD6DED1D9D5DDD3DBD7DFD
    038343C323A363E3139353D333B373F30B8B4BCB2BAB6BEB1B9B5BDB3BBB7BFB
    078747C727A767E7179757D737B777F70F8F4FCF2FAF6FEF1F9F5FDF3FBF7FFF`

    /**
     * Reverse buffer of bits
     * @param b buffer to be reversed
     */
    function rbuffer(b: Buffer): Buffer {
        let output = pins.createBuffer(b.length);
        for (let i = 0; i < b.length; i++) {
            let n = b[i]
            output[i] = rbit(n)
        }
        return output
    }

    /**
     * Reverse bit
     * @param value to be reversed
     */
    function rbit(value: number): number {
        return rbits[value] || 0x00;
    }
    // }
}

