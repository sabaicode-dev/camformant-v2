import sendResponse from "@/src/utils/send-response";
import { Controller, Get, Route, Tags } from "tsoa";

@Route("v1/users")
export class HealthController extends Controller {
  @Get("health")
  @Tags("Health")
  public async getHealth(): Promise<{ message: string }> {
    try {
      return sendResponse({ message: "OK", data: [] });
    } catch (error) {
      throw error;
    }
  }
}
