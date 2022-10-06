import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";

// TODO: Fetch from https://docs.aws.amazon.com/AmazonS3/latest/API/API_Operations.html
const APIS = [
    "AbortMultipartUpload",
    "CompleteMultipartUpload",
    "CopyObject",
    "CreateBucket",
    "CreateMultipartUpload",
    "DeleteBucket",
    "DeleteBucketAnalyticsConfiguration",
    "DeleteBucketCors",
    "DeleteBucketEncryption",
    "DeleteBucketIntelligentTieringConfiguration",
    "DeleteBucketInventoryConfiguration",
    "DeleteBucketLifecycle",
    "DeleteBucketMetricsConfiguration",
    "DeleteBucketOwnershipControls",
    "DeleteBucketPolicy",
    "DeleteBucketReplication",
    "DeleteBucketTagging",
    "DeleteBucketWebsite",
    "DeleteObject",
    "DeleteObjects",
    "DeleteObjectTagging",
    "DeletePublicAccessBlock",
    "GetBucketAccelerateConfiguration",
    "GetBucketAcl",
    "GetBucketAnalyticsConfiguration",
    "GetBucketCors",
    "GetBucketEncryption",
    "GetBucketIntelligentTieringConfiguration",
    "GetBucketInventoryConfiguration",
    "GetBucketLifecycle",
    "GetBucketLifecycleConfiguration",
    "GetBucketLocation",
    "GetBucketLogging",
    "GetBucketMetricsConfiguration",
    "GetBucketNotification",
    "GetBucketNotificationConfiguration",
    "GetBucketOwnershipControls",
    "GetBucketPolicy",
    "GetBucketPolicyStatus",
    "GetBucketReplication",
    "GetBucketRequestPayment",
    "GetBucketTagging",
    "GetBucketVersioning",
    "GetBucketWebsite",
    "GetObject",
    "GetObjectAcl",
    "GetObjectAttributes",
    "GetObjectLegalHold",
    "GetObjectLockConfiguration",
    "GetObjectRetention",
    "GetObjectTagging",
    "GetObjectTorrent",
    "GetPublicAccessBlock",
    "HeadBucket",
    "HeadObject",
    "ListBucketAnalyticsConfigurations",
    "ListBucketIntelligentTieringConfigurations",
    "ListBucketInventoryConfigurations",
    "ListBucketMetricsConfigurations",
    "ListBuckets",
    "ListMultipartUploads",
    "ListObjects",
    "ListObjectsV2",
    "ListObjectVersions",
    "ListParts",
    "PutBucketAccelerateConfiguration",
    "PutBucketAcl",
    "PutBucketAnalyticsConfiguration",
    "PutBucketCors",
    "PutBucketEncryption",
    "PutBucketIntelligentTieringConfiguration",
    "PutBucketInventoryConfiguration",
    "PutBucketLifecycle",
    "PutBucketLifecycleConfiguration",
    "PutBucketLogging",
    "PutBucketMetricsConfiguration",
    "PutBucketNotification",
    "PutBucketNotificationConfiguration",
    "PutBucketOwnershipControls",
    "PutBucketPolicy",
    "PutBucketReplication",
    "PutBucketRequestPayment",
    "PutBucketTagging",
    "PutBucketVersioning",
    "PutBucketWebsite",
    "PutObject",
    "PutObjectAcl",
    "PutObjectLegalHold",
    "PutObjectLockConfiguration",
    "PutObjectRetention",
    "PutObjectTagging",
    "PutPublicAccessBlock",
    "RestoreObject",
    "SelectObjectContent",
    "UploadPart",
    "UploadPartCopy",
    "WriteGetObjectResponse",
] as const;

interface Entry {
    api: string;
    docs: string;
    request: string;
    response: string;
}

async function main() {
    const entries: Entry[] = [];

    for (const api of APIS) {
        console.log(`Processing ${api}...`);
        
        const url = `https://docs.aws.amazon.com/AmazonS3/latest/API/API_${api}.html`;
        const page = await axios.get(url);
    
        const $ = cheerio.load(page.data);
    
        const request_syntax = $("h2:contains(\"Request Syntax\") + pre").text();
        const response_syntax = $("h2:contains(\"Response Syntax\") + pre").text();

        // console.log(request_syntax);
        // console.log(response_syntax);

        entries.push({
            api,
            docs: url,
            request: request_syntax,
            response: response_syntax,
        });
    }

    writeFileSync('apis.json', JSON.stringify(entries, null, 2));
}

main().catch(console.error)