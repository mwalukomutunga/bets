// import * as cdk from "aws-cdk-lib";
// import { Construct } from "constructs";
// import * as iam from "aws-cdk-lib/aws-iam";
// import * as apigateway from "aws-cdk-lib/aws-apigateway";
// import { RemovalPolicy } from "aws-cdk-lib";
// import { Duration, aws_kinesis as kinesis } from "aws-cdk-lib";
// import { MethodResponse } from "aws-cdk-lib/aws-apigateway";
// import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

// export class BetappStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     const stream = new kinesis.Stream(this, "BetStream", {
//       streamName: "bets-stream",
//       shardCount: 1,
//       retentionPeriod: Duration.hours(24),
//     });
//     stream.applyRemovalPolicy(RemovalPolicy.DESTROY);

//     // Create an API Gateway
//     const api = new apigateway.RestApi(this, "BetApi", {
//       deployOptions: {
//         stageName: "prod",
//       },
//     });

//     const methodResponse: MethodResponse = {
//       statusCode: "200",
//     };
//     // Create an IAM Role for API Gateway to write to Kinesis
//     const apiGatewayRole = new iam.Role(this, "ApiGatewayRole", {
//       assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
//     });
//     apiGatewayRole.addToPolicy(
//       new PolicyStatement({
//         effect: Effect.ALLOW,
//         resources: ["*"],
//         actions: ["kinesis:*"],
//       })
//     );
//     // We define the JSON Schema for the transformed valid response
//     // const model = api.addModel("BetModel", {
//     //   contentType: "application/json",
//     //   modelName: "BetModel",
//     //   schema: {
//     //     schema: apigateway.JsonSchemaVersion.DRAFT4,
//     //     title: "pollResponse",
//     //     type: apigateway.JsonSchemaType.OBJECT,
//     //     properties: {
//     //       name: { type: apigateway.JsonSchemaType.STRING },
//     //       age: { type: apigateway.JsonSchemaType.INTEGER },
//     //       gender: { type: apigateway.JsonSchemaType.STRING },
//     //     },
//     //     required: ["name", "age"],
//     //   },
//     // });
//     // We define the JSON Schema for the transformed error response
//     // const errorResponseModel = api.addModel("ErrorResponseModel", {
//     //   contentType: "application/json",
//     //   modelName: "ErrorResponseModel",
//     //   schema: {
//     //     schema: apigateway.JsonSchemaVersion.DRAFT4,
//     //     title: "errorResponse",
//     //     type: apigateway.JsonSchemaType.OBJECT,
//     //     properties: {
//     //       state: { type: apigateway.JsonSchemaType.STRING },
//     //       message: { type: apigateway.JsonSchemaType.STRING },
//     //     },
//     //   },
//     // });

//     const putRecordRequestTemplate = {
//       StreamName: "$input.params('stream-name')",
//       Data: "$util.base64Encode($input.json('$.Data'))",
//       PartitionKey: '$input.path("$.name")',
//     };

//     const putRecordMethodOptions = {
//       requestParameters: {
//         ["method.request.header.Content-Type"]: true,
//       },
//     };
//     const bets = api.root.addResource("bets");
//     const putRecordMethod = bets.addMethod(
//       "PUT",
//       new apigateway.AwsIntegration({
//         service: "kinesis",
//         action: "PutRecord",
//         integrationHttpMethod: "POST",
//         options: {
//           credentialsRole: apiGatewayRole,
//           passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
//           requestParameters: {
//             ["integration.request.header.Content-Type"]:
//               "method.request.header.Content-Type",
//           },
//           requestTemplates: {
//             ["application/json"]: JSON.stringify(putRecordRequestTemplate),
//           },
//           integrationResponses: [
//             {
//               statusCode: "200",
//             },
//           ],
//         },
//       }),
//       putRecordMethodOptions
//     );

//     putRecordMethod.addMethodResponse(methodResponse);

//     // Create an integration with Kinesis
//     // const kinesisIntegration = new apigateway.AwsIntegration({
//     //   service: "kinesis",
//     //   integrationHttpMethod: "POST",
//     //   action: "PutRecord",
//     //   options: {
//     //     credentialsRole: apiGatewayRole,
//     //     integrationResponses: [
//     //       { statusCode: '200' },
//     //     ],
//     //     passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
//     //     requestTemplates: {
//     //       "application/json": JSON.stringify({
//     //         StreamName: stream.streamName,
//     //         Data: "$util.base64Encode($input.json('$.Data'))",
//     //         PartitionKey: '$input.path("$.name")',
//     //       }),
//     //     },
//     //   },
//     // });

//     // const bets = api.root.addResource("bets");
//     // bets.addMethod("POST", kinesisIntegration, {
//     //   requestModels: {
//     //     "application/json": model,
//     //   },
//     //   requestValidatorOptions: {
//     //     requestValidatorName: "bets-validator",
//     //     validateRequestBody: true,
//     //     validateRequestParameters: false,
//     //   },
//     //   methodResponses: [
//     //     {
//     //       // Successful response from the integration
//     //       statusCode: "200",
//     //     },
//     //     {
//     //       // Same thing for the error responses
//     //       statusCode: "400",
//     //     },
//     //   ],
//     // });

//     // new cdk.CfnOutput(this, "ApiEndpoint", {
//     //   value: api.url,
//     // });
//   }
// }
