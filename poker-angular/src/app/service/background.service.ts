import { Injectable } from '@angular/core';
import { S3Service } from '../service/s3.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(private s3Service: S3Service, private logger: LoggerService) { }

  setBackgroundFromFile(filename: string) {
    this.s3Service.setActiveBackground(filename).subscribe(
      this.setBackgroundFromBlob,
      (error) => this.logger.error('Error activating file', error)
    );
  }

  setBackground() {
    this.s3Service.getActiveBackground().subscribe(
      this.setBackgroundFromBlob,
      (error) => this.logger.error('Error activating file', error)
    );
  }

  private setBackgroundFromBlob(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const currentBackground = document.body.style.backgroundImage;

    if (currentBackground !== `url("${url}")`) {
      document.body.style.backgroundImage = `url(${url})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    }
  }

}
