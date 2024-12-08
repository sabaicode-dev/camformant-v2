export interface getMultiProfileCompanyResponse{
    companiesProfile: CompaniesProfile[];
}
interface CompaniesProfile{
    _id?: string;
    profile?: string;
    name?: string;
  }