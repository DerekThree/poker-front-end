import { Component } from '@angular/core';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent {
  region = "us-east-2";
  accessKeyId = "";
  secretAccessKey = "";
  bucketName = "derek-poker-backgrounds";
  s3: AWS.S3;

  constructor() {
    AWS.config.update({
      region: this.region,
      credentials: new AWS.Credentials(this.accessKeyId, this.secretAccessKey)
    });

    this.s3 = new AWS.S3();
  }

  ngAfterViewInit() {
    this.fetchBucketFiles(this.bucketName);
  }
  
  fetchBucketFiles(bucketName: string) {
    const tableBody = document.querySelector("#fileTable tbody")
  
    this.s3.listObjectsV2({Bucket:bucketName}, (err, data) =>{
      if (err) {
          console.log("Error while fetching file list:", err)
      } else {
        console.log("table data:", data)
        if (tableBody) {
          tableBody.innerHTML = '';
        }
        if (data.Contents) {
          data.Contents.forEach((object) => {
            // Name
            const fileRow =  document.createElement('tr');
            const fileNameCell = document.createElement('td');
            fileNameCell.textContent = object.Key ?? ''
            fileRow.appendChild(fileNameCell)

            // Size
            const fileSizeCell= document.createElement('td')
            fileSizeCell.textContent = object.Size?.toString() ?? ''
            fileRow.appendChild(fileSizeCell)

            // Download
            var downloadCell = document.createElement('td');
            var downloadLink = document.createElement('a');
            downloadLink.href = this.s3.getSignedUrl('getObject', {
                Bucket: bucketName,
                Key: object.Key,
                ResponseContentDisposition: 'attachment'
            });
            object.Key? downloadLink.setAttribute("download", object.Key): null;
            downloadLink.textContent = "Download";
            downloadCell.appendChild(downloadLink);
            fileRow.appendChild(downloadCell);

            // Delete
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button')
            deleteButton.textContent = "Delete"
            deleteButton.addEventListener('click', () => {
              this.deleteFile(bucketName, object.Key??'')
            })
            deleteCell.appendChild(deleteButton);
            fileRow.appendChild(deleteCell);

            // Activate
            const activateCell = document.createElement('td');
            const activateButton = document.createElement('button')
            activateButton.textContent = "Activate"
            activateButton.addEventListener('click', () => {
              this.activateBackground(bucketName, object.Key??'')
            })
            activateCell.appendChild(activateButton);
            fileRow.appendChild(activateCell);

            tableBody?.appendChild(fileRow);
          })
        }
      }
    })
  }

  deleteFile(bucketname: string, key: string) {
    const params = {
      Bucket: bucketname,
      Key: key
    }

    this.s3.deleteObject(params, (err, data) => {
      console.log("file deleted")
      this.fetchBucketFiles(bucketname)
    })
  }

  uploadFile(bucketname: string) {
    console.log("uploading file");
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      const files = fileInput.files;
      const fileCount = files.length
      for(let i = 0; i < fileCount; i++) {
        const file = files[i]
        const params = {
          Bucket: bucketname,
          Key: file.name,
          Body: file
        }
        this.s3.upload(params, (err: any, data: any) => {
          console.log("file uploaded: " + file.name)
          this.fetchBucketFiles(bucketname)
        })
      }
      fileInput.value = '';
    } else {
      console.log("no file to upload");
    }
  }

  async activateBackground(bucketname: string, key: string) {
    const params = {
      Bucket: bucketname,
      Key: key,
    }

    let fileUrl = '';
    try {
      fileUrl = await this.s3.getSignedUrlPromise('getObject', params);
    } catch (err) {
      console.log("Error while fetching file:", err);
    }
    this.setBackground(fileUrl);
    localStorage.setItem('backgroundFileUrl', fileUrl); 
  }

  setBackground(fileUrl: string) {
    document.body.style.backgroundImage = `url(${fileUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  }
}
