const CustomLabel: React.FC<{text:string}>= ({text}) => {
  return ( 
    <div className="mx-5 mt-10">
      <label className="font-bold text-[25px]">{text}</label>
    </div>
   );
}
 
export default CustomLabel;