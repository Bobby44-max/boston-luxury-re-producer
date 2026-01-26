/**
 * Remotion Lambda Deployment Script
 *
 * Prerequisites:
 * 1. AWS CLI configured: aws configure
 * 2. IAM user with these permissions:
 *    - AWSLambdaFullAccess
 *    - AmazonS3FullAccess
 *    - IAMFullAccess (for role creation)
 *
 * Run: npx ts-node scripts/deploy-lambda.ts
 */

import {
  deployFunction,
  deploySite,
  getOrCreateBucket,
} from '@remotion/lambda';
import path from 'path';

const REGION = 'us-east-1'; // Change to your preferred region
const RAM = 2048; // MB - increase for faster renders
const TIMEOUT = 240; // seconds

// Helper to wait for IAM role propagation
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function deployWithRetry(maxRetries = 3): Promise<{ functionName: string; alreadyExisted: boolean }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await deployFunction({
        region: REGION,
        timeoutInSeconds: TIMEOUT,
        memorySizeInMb: RAM,
        createCloudWatchLogGroup: true,
      });
      return result;
    } catch (error: any) {
      if (error.message?.includes('cannot be assumed by Lambda') && attempt < maxRetries) {
        console.log(`   ⏳ Waiting for IAM role to propagate (attempt ${attempt}/${maxRetries})...`);
        await sleep(10000); // Wait 10 seconds for role propagation
      } else {
        throw error;
      }
    }
  }
  throw new Error('Failed to deploy Lambda function after retries');
}

async function deploy() {
  console.log('🚀 Starting Remotion Lambda deployment...\n');

  // Step 1: Get or create S3 bucket
  console.log('📦 Setting up S3 bucket...');
  const { bucketName } = await getOrCreateBucket({
    region: REGION,
  });
  console.log(`   Bucket: ${bucketName}\n`);

  // Step 2: Deploy the Remotion site (bundled compositions)
  console.log('📤 Deploying Remotion site to S3...');
  const { serveUrl } = await deploySite({
    bucketName,
    entryPoint: path.resolve(process.cwd(), 'remotion/index.ts'),
    region: REGION,
    siteName: 'real-easy-realty-videos',
  });
  console.log(`   Serve URL: ${serveUrl}\n`);

  // Step 3: Deploy the Lambda function (with retry for IAM propagation)
  console.log('⚡ Deploying Lambda function...');
  const { functionName, alreadyExisted } = await deployWithRetry(3);
  console.log(`   Function: ${functionName}`);
  console.log(`   Status: ${alreadyExisted ? 'Updated' : 'Created'}\n`);

  // Output environment variables to add
  console.log('✅ Deployment complete!\n');
  console.log('Add these to your .env.local and Vercel:');
  console.log('─'.repeat(50));
  console.log(`REMOTION_AWS_REGION=${REGION}`);
  console.log(`REMOTION_BUCKET_NAME=${bucketName}`);
  console.log(`REMOTION_FUNCTION_NAME=${functionName}`);
  console.log(`REMOTION_SERVE_URL=${serveUrl}`);
  console.log('─'.repeat(50));
}

deploy().catch((err) => {
  console.error('❌ Deployment failed:', err);
  process.exit(1);
});
