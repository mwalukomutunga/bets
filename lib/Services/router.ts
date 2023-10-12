import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";


async function handler(event:APIGatewayProxyEvent, context: Context) {
    const response: APIGatewayProxyResult ={
        statusCode:200,
        body: JSON.stringify(event.body)
    }
    console.log(event.body)
    return response;
}
export  {handler}