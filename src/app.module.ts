import { Module } from '@nestjs/common';
import { SerialPortModule } from './serial-handler/serial-port.module';

@Module({
  imports: [SerialPortModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
