import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  fetchBucketFiles(): Observable<any> {
    // const body = { username: 'user1' };
    return this.http.post(this.baseUrl + '/v1/s3/getFiles', {});
  }

  getUploadUrl(filename: string): Observable<string> {
    const body = { filename };
    return this.http.post(`${this.baseUrl}/v1/s3/getUploadUrl`, body, { responseType: 'text' });
  }

  async uploadFile(file: File): Promise<Observable<any>> {
    try {
      const uploadUrl = await this.getUploadUrl(file.name).toPromise();
      if (!uploadUrl) {
        throw new Error('Failed to get upload URL');
      }

      const s3response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (s3response.ok) {
        console.log('Uploaded file:', file.name);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    return this.fetchBucketFiles();
  }
  
  deleteFile(filename: string): Observable<any>  {
    const body = { filename };
    return this.http.post<{ fileNames: string[] }>(this.baseUrl + '/v1/s3/deleteFile', body);
  }

  getActiveBackground(): Observable<any>   {
    // const body = { username: "user1" };
    return this.http.post(this.baseUrl + '/v1/background/getActive', {}, { responseType: 'blob' });
  }
  
  setActiveBackground(filename: string): Observable<any>   {
    const body = { filename };
    return this.http.post(this.baseUrl + '/v1/background/setActive', body, { responseType: 'blob' });
  }

}
