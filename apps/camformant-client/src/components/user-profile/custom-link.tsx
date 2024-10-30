const CustomLink:React.FC<{
  placeHolder:string
  value:string
}>= ({
  placeHolder="Default",
  value="gay"
}
) => {
  return ( 
    <div className="w-full container relative pt-10">
      <input type="url" value={placeHolder} className="w-full outline-none rounded-2xl p-5 shadow-md shadow-black-300 pl-7"/>
    </div>
   );
}
 
export default CustomLink;