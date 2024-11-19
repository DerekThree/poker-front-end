import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { S3Service } from '../service/s3.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(private s3Service: S3Service) { }

  setBackgroundFromFile(filename: string) {
    const body = { username: "user1", filename: filename };
    this.s3Service.setActiveBackground(filename).subscribe(
      this.setBackgroundFromBlob,
      this.handleError
    );
  }

  setBackground() {
    this.s3Service.getActiveBackground().subscribe(
      this.setBackgroundFromBlob,
      this.handleError
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

  private handleError(error: any) {
    console.error('Error activating file', error);
  }
}
