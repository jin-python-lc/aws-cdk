#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AwsCdkLabStack } from '../lib/aws-cdk-lab-stack';

const app = new cdk.App();
new AwsCdkLabStack(app, 'AwsCdkLabStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
      }
});
