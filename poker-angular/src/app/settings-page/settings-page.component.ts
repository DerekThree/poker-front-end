import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../service/logger.service';
import { TopBarComponent } from "../top-bar/top-bar.component";
import { BackgroundService } from '../service/background.service';
import { S3Service } from '../service/s3.service';

@Component({
  selector: 'app-settings-page',
  // standalone: true,
  // imports: [CommonModule, TopBarComponent ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent {
  files: { name: string, url: string }[] = [];

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private backgroundService: BackgroundService,
              private s3Service: S3Service) {}

  ngOnInit() {
    this.backgroundService.setBackground();
    this.fetchBucketFiles();
  }
  
  fetchBucketFiles() {
    this.s3Service.fetchBucketFiles().subscribe(
      files => {
        this.files = files;
      },
      error => {
        this.logger.error('Error fetching files', error);
      }
    );
  }

  deleteFile(filename: string) {
    this.s3Service.deleteFile(filename).subscribe(
      files => {
        this.files = files;
      },
      error => {
        this.logger.error('Error deleting file', error);
      }
    );
  }

  async uploadFile() {
  
    this.logger.debug("uploading file");
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      (await this.s3Service.uploadFile(file)).subscribe(
        files => {
          this.files = files;
          fileInput.value = '';
        },
        error => {
          this.logger.error('Error uploading file', error);
        }
      );
    }
  }

  async activateFile(filename: string) {
    this.backgroundService.setBackgroundFromFile(filename);
  }

  downloadFile(fileUrl: string) {
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // a.download = this.getFileNameFromUrl(fileUrl);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading file:', error);
    });
  }
}
