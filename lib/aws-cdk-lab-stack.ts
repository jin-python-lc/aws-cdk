import { Construct, Stack, StackProps } from '@aws-cdk/core';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';

const adminGroupName = 'GroupMadeByCdk';
const policyName = 'AdministratorPolicyMadeByCdk';

export class AwsCdkLabStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcId: 'vpc-fc9f679a'
    });
    const subnetId = `${vpc.publicSubnets[0].subnetId}`;

    for (let i = 0; i < 5; i++) {
      new ec2.CfnInstance(this, `cdkInstance${i+1}`, {
        instanceType: 't2.micro',
        imageId: 'ami-0ca38c7440de1749a',
        keyName: 'KeyTestServer',
        subnetId: `${subnetId}`,
        privateIpAddress: `172.31.32.${i+100}`,
        tags: [{
          key: 'Name',
          value: 'MadeByCdk',
        }],
      });
    };

    const policyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      notActions: ["aws-portal:*"],
      resources: ["*"]
    });

    const policy = new iam.Policy(this, policyName, {
      policyName,
      statements: [policyStatement]
    });

    const group = new iam.Group(this, adminGroupName, {
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('IAMUserChangePassword'),
      ],
    });
    group.attachInlinePolicy(policy);

    for (let i = 0; i < 5; i++) {
      let userName = `userMadeByCdk-${i+1}`;
      new iam.User(this, userName, {
        userName,
        groups: [group],
        password: cdk.SecretValue.plainText('P@ssW0rdF0r1am'),
        passwordResetRequired: true
      });
      //iamUser.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('IAMUserChangePassword'))
    }
  }
}
