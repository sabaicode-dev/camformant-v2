const DropDownMenu:React.FC<{
  setValue:(value: string) => void,
  currentText:string,
  arrText:string[]
}> = ({
  setValue,
  currentText,
  arrText
}) => {
  return ( 
    <div className="w-full container pt-10">
      <select className="min-w-full h-16 w-full outline-none rounded-2xl p-5 shadow-md shadow-black-300 pl-7 text-gray-400"
      value={currentText}
      onChange={(e)=>setValue(e.target.value)}
      >
        {
          arrText.map((text:string)=>(
            <option value={text}>{text}</option>
          )

          )
        }
      </select>
    </div>
   );
}
 
export default DropDownMenu;