Skyfall
===

A home measurement system running on the [Particle Photon][0].

## Hardware
- Particle Photon
    - USB power source
- SparkFun [Photon Weather Shield][1]
    - Relevant [pin-out diagram][2]
- Simple photoresistor
    - With 330 ohm resistor
- Breadboard, wiring

## Software
This setup is running a remote Node.js server that accesses sensor data and output via [voodoospark][3].

[0]: https://www.particle.io/products/hardware/photon-wifi-dev-kit
[1]: https://learn.sparkfun.com/tutorials/photon-weather-shield-hookup-guide/
[2]: https://cdn.sparkfun.com/datasheets/IoT/SparkFun_Photon_Weather_Shield_v10a.pdf
[3]: https://github.com/voodootikigod/voodoospark
