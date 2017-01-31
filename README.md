Skyfall
===

A home measurement system running on the [Particle Photon][0].

## Hardware
- Particle Photon
    - USB power source
- SparkFun [Photon Weather Shield][1]
    - Relevant [pin-out diagram][2]
    - Relevant [library/code][4]
- Simple photoresistor
    - With 330 ohm resistor
- Breadboard, wiring

## Software
This setup is running a remote Node.js server that accepts incoming sensor data via webhooks initiated by the Photon. See `skyfall.ino` for the on-board software and `photon.js` for an interface programmed via [voodoospark][3].

[0]: https://www.particle.io/products/hardware/photon-wifi-dev-kit
[1]: https://learn.sparkfun.com/tutorials/photon-weather-shield-hookup-guide/
[2]: https://cdn.sparkfun.com/datasheets/IoT/SparkFun_Photon_Weather_Shield_v10a.pdf
[3]: https://github.com/voodootikigod/voodoospark
[4]: https://github.com/sparkfun/sparkfun_photon_weather_shield_particle_library
