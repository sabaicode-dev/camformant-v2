import AdminRepository from "@/src/database/repositories/admin.repositiory";
import { prettyObject } from "@sabaicode-dev/camformant-libs";
import { AdminProfileParams } from "@/src/database/models/admin.model";
class AdminService{
  public async getProfileBySub(adminSub:string):Promise<AdminProfileParams>{
    try{
      const response=await AdminRepository.getProfileBySub(adminSub);
      return response
    }
    catch(err){
       console.error(
              `AdminService - getProfileById() method error: `,
              prettyObject(err as {})
            );
      throw err
    }

  }
}
export default new AdminService();