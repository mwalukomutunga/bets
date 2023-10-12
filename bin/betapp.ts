#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BetappStack } from '../lib/betapp-stack';

const app = new cdk.App();
new BetappStack(app, 'BetappStack', {

});
