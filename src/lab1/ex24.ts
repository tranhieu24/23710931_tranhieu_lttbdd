abstract class Appliance {
  abstract turnOn(): void;

  turnOff(): void {
    console.log("Thiết bị đã tắt");
  }
}

class Fan extends Appliance {
  turnOn(): void {
    console.log("Quạt đang bật, gió thổi mát!");
  }
}

class AirConditioner extends Appliance {
  turnOn(): void {
    console.log("Máy lạnh đang bật, làm mát phòng!");
  }
}

const fan1 = new Fan();
const ac1 = new AirConditioner();
fan1.turnOn();
ac1.turnOn();
ac1.turnOff();

export {};
