// error to nodejs trace kr deta hai but response express ke through aata hai nodejs ke through //nahi aaata

class ApiResponse{
      constructor(statusCode,data,message="Success"){
            this.statusCode=statusCode;
            this.data=data;
            this.message=message;
            this.success=statusCode < 400
      }
}