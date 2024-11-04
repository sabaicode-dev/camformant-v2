import { Home, Slash } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ContactSearch = () => {
  return (
    <div className="bg-white w-5/6  border border-gray-300 m-auto rounded-md flex">
      <Input
        placeholder="Contact App"
        className=" h-[24px] p-[24px] bg-white"
      />
      <div className="flex gap-1 px-4 items-center ">
        <Home />
        <Slash />
        <Button className="text-orange-400 bg-orange-200 rounded-2xl">Contact</Button>
      </div>
    </div>
  );
};
export default ContactSearch;
