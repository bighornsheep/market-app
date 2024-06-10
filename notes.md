# Write File to S3
- Create S3 bucket
- Set up IAM user and set up access keys for this user
- Get `aws-sdk`
- Set Permissions
    - Block all public access -> Off
    - Set ACL -> read, write
    - Update CORS