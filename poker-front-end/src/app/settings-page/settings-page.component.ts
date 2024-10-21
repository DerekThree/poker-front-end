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
    this.FetchBucketFiles(this.bucketName);
  }
  
  FetchBucketFiles(bucketName: string) {
    const tableBody = document.querySelector("#fileTable tbody")
  
    this.s3.listObjectsV2({Bucket:bucketName}, (err, data) =>{
      if (err) {
          console.log("Error while fetching file list:", err)
      } else {
        console.log("table data:", data)

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

            tableBody?.appendChild(fileRow);
          })
        }
      }
    })
  }
}
