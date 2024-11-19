import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent {
  filenames: string[] = [];

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.fetchBucketFiles();
  }
  
  fetchBucketFiles() {
    const body = { username: 'user1' };
    this.http.post<{ fileNames: string[] }>('http://localhost:8080/v1/s3/getFiles', body).subscribe(
      data => {
        this.filenames = data.fileNames;
      },
      error => {
        console.error('Error fetching files', error);
      }
    );
  }

  deleteFile(filename: string) {
    const body = { username: 'user1', filename: filename };
    this.http.post<{ fileNames: string[] }>('http://localhost:8080/v1/s3/deleteFile', body).subscribe(
      data => {
        this.filenames = data.fileNames;
      },
      error => {
        console.error('Error fetching files', error);
      }
    );
  }

  uploadFile() {
    console.log("uploading file");
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('username', 'user1');
      formData.append('file', file);

      this.http.post('http://localhost:8080/v1/s3/uploadFile', formData).subscribe(
        () => {
          this.fetchBucketFiles();
        },
        error => {
          console.error('Error uploading file', error);
        }
      );
    }
  }

  async activateFile(filename: string) {
    const body = { username: "user1", filename: filename };
    this.http.post('http://localhost:8080/v1/background/setActive', body, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        document.body.style.backgroundImage = `url(${url})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
      },
      error => {
        console.error('Error activating file', error);
      }
    );
  }

  setBackground(fileUrl: string) {
    document.body.style.backgroundImage = `url(${fileUrl})`;
    document.body.style.backgroundSize = 'cover';
    // document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  }
}
