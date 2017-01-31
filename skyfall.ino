// This #include statement was automatically added by the Particle IDE.
#include <SparkFun_Photon_Weather_Shield_Library.h>

// -----------------------------------------
// Publish and Dashboard with Photoresistors
// -----------------------------------------
// This app will publish events for photoresistor,
// humistor, baroresistor, thermoresistor sensors.

char Org[] = "ANDJOSH";
char Disp[] = "SKYFALL";
char Locn[] = "SKYFALL";

int refreshRate = 1000;
int boardLed = D7; // This is the LED that is already on your device.
// On the Photon, it's next to the D7 pin.

int photoresistor = A4; // This is where your photoresistor is plugged in. The other side goes to the "power" pin (below).
int power = A5; // This is the other end of your photoresistor. The other side is plugged into the "photoresistor" pin (above).

Weather sensor;

// We start with the setup function.
void setup() {
  // This part is mostly the same:
  // pinMode(boardLed,OUTPUT); // Our on-board LED is output
  pinMode(photoresistor,INPUT);  // Our photoresistor pin is input (reading the photoresistor)
  pinMode(power,OUTPUT); // The pin powering the photoresistor is output (sending out consistent power)

  // Next, write the power of the photoresistor to be the maximum possible, which is 4095 in analog.
  digitalWrite(power,HIGH);

  Serial.begin(9600);
  //Initialize the I2C sensors and ping them
  sensor.begin();
  
  /*You can only receive acurate barrometric readings or acurate altitiude
  readings at a given time, not both at the same time. The following two lines
  tell the sensor what mode to use. You could easily write a function that
  takes a reading in one made and then switches to the other mode to grab that
  reading, resulting in data that contains both acurate altitude and barrometric
  readings. For this example, we will only be using the barometer mode. Be sure
  to only uncomment one line at a time. */
  sensor.setModeBarometer();//Set to Barometer Mode
  //baro.setModeAltimeter();//Set to altimeter Mode
  
  //These are additional MPL3115A2 functions the MUST be called for the sensor to work.
  sensor.setOversampleRate(7); // Set Oversample rate
  //Call with a rate from 0 to 7. See page 33 for table of ratios.
  //Sets the over sample rate. Datasheet calls for 128 but you can set it
  //from 1 to 128 samples. The higher the oversample rate the greater
  //the time between data samples.
  
  sensor.enableEventFlags(); //Necessary register calls to enble temp, baro and alt
  
  // First, the D7 LED will go on
  // digitalWrite(boardLed,HIGH);

  delay(10000);
}

// Now for the loop.
void loop() {

  delay(refreshRate);

  // Measure Relative Humidity from the HTU21D or Si7021
  float h = sensor.getRH();
  
  // Measure Temperature from the HTU21D or Si7021
  // Temperature is measured every time RH is requested.
  // It is faster, therefore, to read it from previous RH
  // measurement with getTemp() instead with readTemp()
  float c = sensor.getTemp();

  // Measure Pa pressure from the MPL3115A2
  float p = sensor.readPressure();

  // Measure light from the photoresistor
  int l = analogRead(photoresistor);
  
  char payload[255];

  snprintf(payload, sizeof(payload), "{ \"C\": %f, \"KPA\": %f,\"RL\": %d,\"RH\": %f,\"LOCN\":\"%s\",\"ORG\": \"%s\",\"DISP\":\"%s\" }", c, p, l, h, Locn, Org, Disp);
  // Serial.println(payload);
  Spark.publish(Disp, payload);

}

