import AWS from 'aws-sdk';

export function userDownloadAWSUpload(obj, fileName) {
    AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.REACT_APP_AWS_REGION
    });
    
    const params = {
        Bucket: 'daspeks-file-storage',
        ACL: 'public-read'
    };
    
    let url = '';
    const s3 = new AWS.S3();

    if (fileName.startsWith('Canada')) {
        // create a Blob from the CSV data
        const blob = new Blob([obj], {type: 'text/csv'});
        const file = new File([blob], `${fileName}.csv`, {type:"text/csv", lastModified:new Date().getTime()});
        params['Key'] = file.name;
        params['Body'] = file;

        s3.putObject(params, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Canada file uploaded to S3', data);
            }
        });

        // 
        url = window.URL.createObjectURL(blob);
        // create a temporary <a> element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    else {
        const file = new File([obj], `${fileName}.xlsx`, {type:"text/xlsx", lastModified:new Date().getTime()});
        params['Key'] = file.name;
        params['Body'] = file;

        s3.putObject(params, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log('German file uploaded to S3', data);
            }
        });

        url = window.URL.createObjectURL(file);

        // create a temporary <a> element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}