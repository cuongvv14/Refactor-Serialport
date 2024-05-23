import { Injectable, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

@Injectable()
export class SerialPortService {
  private readonly logger = new Logger(SerialPortService.name);

  constructor() {
    this.connectToSerialPorts();
  }
  private connectToSerialPorts() {
    SerialPort.list()
      .then((ports) => {
        const suitablePorts = ports.filter((port) => port.path.includes('COM'));

        if (suitablePorts.length > 0) {
          suitablePorts.forEach((portInfo) => {
            const port = new SerialPort({
              path: portInfo.path,
              baudRate: 9600,
              dataBits: 8,
              stopBits: 1,
              parity: 'none',
            });

            const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
            parser.on('data', (data) => {
              this.logger.log(`Data received from ${portInfo.path}: ${data}`);
            });

            port.on('open', () => {
              this.logger.log(`Port ${portInfo.path} opened`);
              port.write(
                'AT+QR_DISPLAY=100,00020101021138570010A00000072701270006970436011305510003253210208QRIBFTTA53037045802VN6304AF96\r\n',
              );
            });

            port.on('error', (err) => {
              this.logger.error(
                `Error on port ${portInfo.path}: ${err.message}`,
              );
            });
          });
        } else {
          this.logger.error('No suitable serial ports found.');
        }
      })
      .catch((err) => {
        this.logger.error('Error listing serial ports:', err);
      });
  }
}
