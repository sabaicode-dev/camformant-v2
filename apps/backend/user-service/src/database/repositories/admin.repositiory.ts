import { NotFoundError, prettyObject } from "@sabaicode-dev/camformant-libs";
import { AdminModel, AdminProfileParams } from "@/src/database/models/admin.model";

class AdminRepository{
  public async getProfileBySub(adminSub:string):Promise<AdminProfileParams>{
    try {
      const result = await AdminModel.findOne({
        sub:adminSub
      });
      if (!result) {
        throw new NotFoundError("User is not found");
      }

      return result as AdminProfileParams;
    } catch (error) {
      console.error(
        `UserRepository - findById() method error: `,
        prettyObject(error as {})
      );
      throw error;
    }


  }
  
}
export default new AdminRepository()