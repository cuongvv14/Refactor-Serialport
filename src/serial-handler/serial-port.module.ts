import { Module } from '@nestjs/common';
import { SerialPortService } from './serial-port.service';

@Module({
  providers: [SerialPortService],
  exports: [SerialPortService],
})
export class SerialPortModule {}
