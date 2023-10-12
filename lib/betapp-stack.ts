import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { RemovalPolicy } from "aws-cdk-lib";
import { Duration, aws_kinesis as kinesis } from "aws-cdk-lib";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import path = require("path");
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
export class BetappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const stream = new kinesis.Stream(this, "BetStream", {
    //   streamName: "bets-stream",
    //   shardCount: 1,
    //   retentionPeriod: Duration.hours(24),
    // });
    // stream.applyRemovalPolicy(RemovalPolicy.DESTROY);

    // Create an API Gateway
    const api = new apigateway.RestApi(this, "BetApi", {
      deployOptions: {
        stageName: "prod",
      },
    });

    const myRole = new iam.Role(this, "My Role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    const fn = new NodejsFunction(this, "ApiBet", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname, "Services", "router.ts"),
    });

    const requestModel = api.addModel("requestModel", {
      contentType: "application/json",
      modelName: "requestModel",
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: "pollResponse",
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          name: { type: apigateway.JsonSchemaType.STRING },
          age: { type: apigateway.JsonSchemaType.INTEGER },
        },
        required: ["name", "age"],
      },
    });


    // Create an integration between API Gateway and Lambda
    const integration = new apigateway.LambdaIntegration(fn, {
      integrationResponses: [
        {
          // For errors, we check if the error message is not empty, get the error data
          selectionPattern: "(\n|.)+",
          // We will set the response status code to 200
          statusCode: "400",
          responseTemplates: {
            "application/json": "$input.json('$')",
          },
          responseParameters: {
            "method.response.header.Content-Type": "'application/json'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials": "'true'",
          },
        },
      ],
    });
    const bets = api.root.addResource("bets");

    bets.addMethod("POST", integration, {
      requestModels: {
        "application/json": requestModel,
      },
      // we can set request validator options like below
      requestValidatorOptions: {
        validateRequestBody: true,
        validateRequestParameters: false,
        
      },
      methodResponses: [
        {
          // Same thing for the error responses
          statusCode: "400",
          responseParameters: {
            "method.response.header.Content-Type": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
        },
      ],
    });
  }
}
